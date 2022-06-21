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

  def postExercise: Action[ExerciseInput] = jwtAuthenticatedAction.async(parse.json[ExerciseInput](Exercise.exerciseInputJsonFormat)) { request =>
    val ExerciseInput(title, text, sampleSolution) = request.body

    for {
      maxExerciseId <- mongoQueries.futureMaxExerciseId

      nextExerciseId = maxExerciseId.map(_ + 1).getOrElse(0)

      _ <- mongoQueries.futureInsertExercise(Exercise(nextExerciseId, title, text, sampleSolution))
    } yield Ok(Json.toJson(nextExerciseId))
  }

  def postSolution(exerciseId: Int): Action[UserSolutionInput] =
    jwtAuthenticatedAction.async(parse.json[UserSolutionInput](UserSolutionInput.userSolutionInputJsonFormat)) { request =>
      val UserSolutionInput(maybeUsername, solution) = request.body

      for {
        saved <- mongoQueries.futureInsertCompleteUserSolution(
          UserSolution(maybeUsername.getOrElse(request.username), exerciseId, solution)
        )
      } yield Ok(Json.toJson(saved))
    }

  def correctionValues(exerciseId: Int, username: String): Action[AnyContent] = jwtAuthenticatedAction.async { _ =>
    mongoQueries.futureExerciseById(exerciseId).flatMap {
      case None => Future.successful(BadRequest(s"No such exercise $exerciseId!"))
      case Some(Exercise(_, _, _, sampleSolution)) =>
        mongoQueries.futureUserSolutionForExercise(exerciseId, username).map {
          case None => BadRequest(s"No solution for user $username for exercise $exerciseId")
          case Some(UserSolution(_, _, userSolution)) =>
            Ok(Json.toJson(CorrectionValues(sampleSolution, userSolution))(CorrectionValues.correctionValuesJsonFormat))
        }
    }
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
