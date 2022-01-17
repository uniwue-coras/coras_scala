package controllers

import better.files._
import model.graphql.{GraphQLContext, GraphQLModel, GraphQLRequest}
import model.{DocxReader, DocxText, JwtHelpers, TableDefs}
import play.api.Logger
import play.api.libs.Files
import play.api.libs.json.{Json, OFormat, Writes}
import play.api.mvc._
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson._
import sangria.parser.QueryParser

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

@Singleton
class HomeController @Inject() (
  cc: ControllerComponents,
  assets: Assets,
  graphQLModel: GraphQLModel,
  tableDefs: TableDefs
)(implicit ec: ExecutionContext)
    extends AbstractController(cc)
    with JwtHelpers {

  private val logger                                        = Logger(classOf[HomeController])
  private val graphQLRequestFormat: OFormat[GraphQLRequest] = Json.format

  def index: Action[AnyContent] = assets.at("index.html")

  def assetOrDefault(resource: String): Action[AnyContent] = if (resource.contains(".")) assets.at(resource) else index

  def graphiql: Action[AnyContent] = Action { implicit request => Ok(views.html.graphiql()) }

  def graphql: Action[GraphQLRequest] = Action.async(parse.json[GraphQLRequest](graphQLRequestFormat)) { implicit request =>
    QueryParser.parse(request.body.query) match {
      case Failure(error) => Future.successful(BadRequest(Json.obj("error" -> error.getMessage)))
      case Success(queryAst) =>
        for {
          maybeUser <- userFromHeader(request, tableDefs)
          result <- Executor
            .execute(
              graphQLModel.schema,
              queryAst,
              operationName = request.body.operationName,
              variables = request.body.variables.getOrElse(Json.obj()),
              userContext = GraphQLContext(tableDefs, maybeUser)
            )
            .map(Ok(_))
            .recover {
              case error: QueryAnalysisError => BadRequest(error.resolveError)
              case error: ErrorWithResolver  => InternalServerError(error.resolveError)
            }
        } yield result
    }
  }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = Action(parse.multipartFormData) { implicit request =>
    val readContent: Try[Seq[DocxText]] = for {
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
