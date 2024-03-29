package controllers

import model._
import model.docxReading.{DocxReader, DocxText}
import model.exporting.{ExportedData, exportFromDb}
import model.graphql._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.Files
import play.api.libs.json.{Json, OFormat, Writes}
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.{Configuration, Logger}
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson._
import sangria.parser.QueryParser

import java.util.UUID
import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

final case class BasicLtiLaunchRequest(
  userId: String,
  extLms: String,
  extUserUsername: String
)

object BasicLtiLaunchRequest:
  // needed for scala3 since unapply method signature changed
  def unapply(lr: BasicLtiLaunchRequest): Option[(String, String, String)] = Some(lr.userId, lr.extLms, lr.extUserUsername)

@Singleton
class HomeController @Inject() (
  ws: WSClient,
  cc: ControllerComponents,
  assets: Assets,
  tableDefs: TableDefs,
  jwtAction: JwtAction,
  configuration: Configuration
)(override implicit val ec: ExecutionContext)
    extends AbstractController(cc)
    with GraphQLModel {

  private val logger                                        = Logger(classOf[HomeController])
  private val graphQLRequestFormat: OFormat[GraphQLRequest] = Json.format

  private val basicLtiLaunchRequestForm: Form[BasicLtiLaunchRequest] = Form(
    mapping(
      "user_id"           -> text,
      "ext_lms"           -> text,
      "ext_user_username" -> text
    )(BasicLtiLaunchRequest.apply)(BasicLtiLaunchRequest.unapply)
  )

  def index: Action[AnyContent] = assets.at("index.html")

  def assetOrDefault(resource: String): Action[AnyContent] = if (resource.contains(".")) assets.at(resource) else index

  def graphiql: Action[AnyContent] = Action { _ => Ok(views.html.graphiql()) }

  def graphql: Action[GraphQLRequest] = jwtAction.async(parse.json(graphQLRequestFormat)) { case JwtRequest(maybeUser, request) =>
    val GraphQLRequest(query, operationName, variables) = request.body

    val userContext = GraphQLContext(ws, tableDefs, maybeUser, ec)

    QueryParser.parse(query) match {
      case Failure(error) => Future.successful(BadRequest(Json.obj("error" -> error.getMessage)))
      case Success(queryAst) =>
        Executor
          .execute(schema, queryAst, userContext = userContext, operationName = operationName, variables = variables.getOrElse(Json.obj()))
          .map(Ok(_))
          .recover {
            case error: QueryAnalysisError =>
              logger.error("Error while analysing query:", error)
              BadRequest(error.resolveError)
            case error: ErrorWithResolver =>
              logger.error("Error while resolving query", error)
              InternalServerError(error.resolveError)
          }
    }
  }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = jwtAction(parse.multipartFormData) { request =>
    val readContent = for {
      file        <- request.body.file("docxFile").toRight(new Exception("No file uploaded!")).toTry
      readContent <- DocxReader.readFile(file.ref.path)
    } yield readContent

    readContent match {
      case Failure(exception) =>
        logger.error("There has been an error reading an docx file", exception)
        BadRequest("No file uploaded")
      case Success(readContent) => Ok(Writes.seq(DocxText.jsonFormat).writes(readContent))
    }
  }

  private val clientUrl = configuration.get[String]("clientUrl")

  def ltiLogin: Action[BasicLtiLaunchRequest] = Action.async(parse.form(basicLtiLaunchRequestForm)) { request =>
    val username = request.body.extUserUsername

    val uuid = UUID.randomUUID().toString

    for {
      maybeUser: Option[User] <- tableDefs.futureMaybeUserByUsername(username)

      _ <- maybeUser match {
        case Some(_) => Future.successful(())
        case None    => tableDefs.futureInsertUser(User(username)).map(_ => ())
      }

      rights = maybeUser.map(_.rights).getOrElse(Rights.Student)

      jwtSession = createJwtSession(username, rights)

      _ = jwtsToClaim.put(uuid, jwtSession)

    } yield Redirect(s"$clientUrl/lti/$uuid")
  }

  def exportData: Action[AnyContent] = Action.async { _ =>
    implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

    for {
      exportedData <- exportFromDb(tableDefs)
    } yield Ok(Json.toJson(exportedData))
  }

}
