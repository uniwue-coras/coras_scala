package controllers

import better.files._
import model.graphql.{GraphQLContext, GraphQLModel, GraphQLRequest}
import model.{DocxReader, DocxText, TableDefs}
import play.api.libs.Files
import play.api.libs.json.{Json, OFormat}
import play.api.mvc._
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson._
import sangria.parser.QueryParser

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

@Singleton
class HomeController @Inject() (
  controllerComponents: ControllerComponents,
  graphQLModel: GraphQLModel,
  tableDefs: TableDefs
)(implicit ec: ExecutionContext)
    extends AbstractController(controllerComponents) {

  private implicit val graphQLRequestFormat: OFormat[GraphQLRequest] = Json.format

  def graphiql: Action[AnyContent] = Action { implicit request => Ok(views.html.graphiql()) }

  def graphql: Action[GraphQLRequest] = Action.async(parse.json[GraphQLRequest]) { implicit request =>
    QueryParser.parse(request.body.query) match {
      case Failure(error) => Future.successful(BadRequest(Json.obj("error" -> error.getMessage)))
      case Success(queryAst) =>
        Executor
          .execute(
            graphQLModel.schema,
            queryAst,
            operationName = request.body.operationName,
            variables = request.body.variables.getOrElse(Json.obj()),
            userContext = GraphQLContext(tableDefs /*, userFromHeader(request)*/ )
          )
          .map(Ok(_))
          .recover {
            case error: QueryAnalysisError => BadRequest(error.resolveError)
            case error: ErrorWithResolver  => InternalServerError(error.resolveError)
          }

    }
  }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = Action(parse.multipartFormData) { implicit request =>
    implicit val x: OFormat[DocxText] = DocxText.jsonFormat

    request.body.file("docxFile") match {
      case None       => BadRequest("No file uploaded")
      case Some(file) => Ok(Json.toJson(DocxReader.readFile(file.ref.path.toFile.toScala)))
    }

  }

}
