package controllers

import model.TableDefs
import model.graphql.{GraphQLContext, GraphQLModel, GraphQLRequest}
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

}
