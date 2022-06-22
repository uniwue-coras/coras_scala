package controllers

import better.files.FileExtensions
import model._
import model.graphql._
import model.lti.BasicLtiLaunchRequest
import play.api.Logger
import play.api.libs.Files
import play.api.libs.json.{Json, OFormat, Writes}
import play.api.mvc._
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson._
import sangria.parser.QueryParser

import java.util.UUID
import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

@Singleton
class HomeController @Inject() (
  cc: ControllerComponents,
  assets: Assets,
  mongoQueries: MongoQueries,
  jwtAction: JwtAction
)(override implicit val ec: ExecutionContext)
    extends AbstractController(cc)
    with GraphQLModel
    with JwtHelpers {

  private val logger                                        = Logger(classOf[HomeController])
  private val graphQLRequestFormat: OFormat[GraphQLRequest] = Json.format

  def index: Action[AnyContent] = assets.at("index.html")

  def assetOrDefault(resource: String): Action[AnyContent] = if (resource.contains(".")) assets.at(resource) else index

  def graphiql: Action[AnyContent] = Action { _ => Ok(views.html.graphiql()) }

  def graphql: Action[GraphQLRequest] = jwtAction.async(parse.json(graphQLRequestFormat)) { case JwtRequest(maybeUser, request) =>
    request.body match {
      case GraphQLRequest(query, operationName, variables) =>
        QueryParser.parse(query) match {
          case Failure(error) => Future.successful(BadRequest(Json.obj("error" -> error.getMessage)))
          case Success(queryAst) =>
            Executor
              .execute(schema, queryAst, GraphQLContext(mongoQueries, maybeUser), (), operationName, variables.getOrElse(Json.obj()))
              .map(Ok(_))
              .recover {
                case error: QueryAnalysisError => BadRequest(error.resolveError)
                case error: ErrorWithResolver  => InternalServerError(error.resolveError)
              }
        }
    }
  }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = jwtAction(parse.multipartFormData) { request =>
    val readContent = for {
      file        <- request.body.file("docxFile").toRight(new Exception("No file uploaded!")).toTry
      readContent <- DocxReader.readFile(file.ref.path.toFile.toScala)
    } yield readContent

    readContent match {
      case Failure(exception) =>
        logger.error("There has been an error reading an docx file", exception)
        BadRequest("No file uploaded")
      case Success(readContent) => Ok(Writes.seq(DocxText.jsonFormat).writes(readContent))
    }

  }

  def ltiLogin: Action[BasicLtiLaunchRequest] = Action.async(parse.form(BasicLtiLaunchRequest.form)) { request =>
    val username = request.body.extUserUsername

    val uuid = UUID.randomUUID().toString

    for {
      maybeUser <- mongoQueries.futureMaybeUserByUsername(username)

      loginResult = LoginResult(username, maybeUser.map(_.rights).getOrElse(Rights.Student), generateJwt(username))

      _ = jwtsToClaim.put(uuid, loginResult)

    } yield Redirect(s"/lti/$uuid").withNewSession
  }

}
