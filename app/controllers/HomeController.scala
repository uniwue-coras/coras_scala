package controllers

import better.files.FileExtensions
import model._
import model.graphql._
import play.api.Logger
import play.api.libs.Files
import play.api.libs.json.{Json, OFormat, Writes}
import play.api.mvc._
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson._
import sangria.parser.QueryParser

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

@Singleton
class HomeController @Inject() (
  cc: ControllerComponents,
  assets: Assets,
  graphQLModel: GraphQLModel,
  mongoQueries: MongoQueries,
  jwtAuthenticatedAction: JwtAuthenticatedAction
)(implicit ec: ExecutionContext)
    extends AbstractController(cc)
    with JwtHelpers {

  private val logger                                        = Logger(classOf[HomeController])
  private val graphQLRequestFormat: OFormat[GraphQLRequest] = Json.format

  def index: Action[AnyContent] = assets.at("index.html")

  def assetOrDefault(resource: String): Action[AnyContent] = if (resource.contains(".")) assets.at(resource) else index

  def graphiql: Action[AnyContent] = Action { _ => Ok(views.html.graphiql()) }

  def graphql: Action[GraphQLRequest] = Action.async(parse.json[GraphQLRequest](graphQLRequestFormat)) { request =>
    // FIXME: use jwtAuthenticatedAction!
    QueryParser.parse(request.body.query) match {
      case Failure(error) => Future.successful(BadRequest(Json.obj("error" -> error.getMessage)))
      case Success(queryAst) =>
        for {
          maybeUser <- userFromHeader(request, mongoQueries)
          result <- Executor
            .execute(
              graphQLModel.schema,
              queryAst,
              operationName = request.body.operationName,
              variables = request.body.variables.getOrElse(Json.obj()),
              userContext = GraphQLContext(mongoQueries, maybeUser)
            )
            .map(Ok(_))
            .recover {
              case error: QueryAnalysisError => BadRequest(error.resolveError)
              case error: ErrorWithResolver  => InternalServerError(error.resolveError)
            }
        } yield result
    }
  }

  @deprecated()
  def postCorrection(exerciseId: Int, username: String): Action[SolutionNodeMatchingResult] =
    jwtAuthenticatedAction.async(parse.json[SolutionNodeMatchingResult](Correction.correctionJsonFormat)) { request =>
      for {
        _               <- mongoQueries.futureDeleteUserSolution(exerciseId, username)
        _               <- mongoQueries.futureDeleteCorrection(exerciseId, username)
        correctionSaved <- mongoQueries.futureInsertCorrection(exerciseId, username, request.body)
      } yield Ok(Json.toJson(correctionSaved))
    }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = jwtAuthenticatedAction(parse.multipartFormData) { request =>
    val readContent = for {
      file <- request.body
        .file("docxFile")
        .map(Success(_))
        .getOrElse(Failure(new Exception("No file uploaded!")))

      readContent <- DocxReader.readFile(file.ref.path.toFile.toScala)

    } yield readContent

    readContent match {
      case Failure(exception) =>
        logger.error("There has been an error reading an docx file", exception)
        BadRequest("No file uploaded")
      case Success(readContent) => Ok(Writes.seq(DocxText.jsonFormat).writes(readContent))
    }

  }

}
