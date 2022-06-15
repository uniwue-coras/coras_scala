package controllers

import better.files.FileExtensions
import com.github.t3hnar.bcrypt._
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
  tableDefs: TableDefs,
  jwtAuthenticatedAction: JwtAuthenticatedAction
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

  def register: Action[RegisterInput] = Action.async(parse.json[RegisterInput](Login.registerInputJsonFormat)) { implicit request =>
    if (request.body.password == request.body.passwordRepeat) {
      tableDefs.futureMaybeUserByName(request.body.username).flatMap {
        case Some(_) => Future.successful(BadRequest("User already exists!"))
        case None =>
          tableDefs
            .futureInsertUser(User(request.body.username, Some(request.body.password.boundedBcrypt)))
            .map(username => Ok(Json.toJson(username)))
      }
    } else {
      Future.successful(BadRequest("Passwords do not match!"))
    }
  }

  def login: Action[LoginInput] = Action.async(parse.json[LoginInput](Login.loginInputJsonFormat)) { implicit request =>
    val onError = BadRequest("Invalid credentials!")

    tableDefs
      .futureMaybeUserByName(request.body.username)
      .map {
        case None                      => onError
        case Some(User(_, None, _, _)) => onError
        case Some(User(username, Some(passwordHash), rights, maybeName)) =>
          if (request.body.password.isBcryptedBounded(passwordHash)) {
            Ok(Json.toJson(LoginResult(username, maybeName, rights, generateJwt(username)))(Login.loginResultJsonFormat))
          } else {
            onError
          }
      }
  }

  def changePassword: Action[ChangePasswordInput] = jwtAuthenticatedAction.async(parse.json[ChangePasswordInput](Login.changePasswordInputJsonFormat)) {
    implicit request =>
      val ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) = request.body

      if (newPassword != newPasswordRepeat) {
        Future.successful(BadRequest("Passwords do not match!"))
      } else {
        tableDefs.futureMaybeUserByName(request.username).flatMap {
          case None                      => Future.successful(BadRequest("No such user..."))
          case Some(User(_, None, _, _)) => ???
          case Some(User(username, Some(passwordHash), _, _)) =>
            if (oldPassword.isBcryptedBounded(passwordHash)) {
              tableDefs
                .futureUpdatePassword(username, newPassword.boundedBcrypt)
                .map(changed => Ok(Json.toJson(changed)))
            } else {
              Future.successful(BadRequest("Could not change password!"))
            }
        }
      }
  }

  def postExercise: Action[NewExerciseInput] = jwtAuthenticatedAction.async(parse.json[NewExerciseInput](NewExerciseInput.jsonFormat)) { implicit request =>
    val NewExerciseInput(title, text, sampleSolution) = request.body

    for {
      exerciseId <- tableDefs.futureInsertCompleteExercise(title, text, Tree.flattenTree(sampleSolution, SolutionNode.flattenSolutionNode))
    } yield Ok(Json.toJson(exerciseId))
  }

  def postSolution(exerciseId: Int): Action[NewUserSolutionInput] =
    jwtAuthenticatedAction.async(parse.json[NewUserSolutionInput](NewUserSolutionInput.jsonFormat)) { implicit request =>
      val NewUserSolutionInput(maybeUsername, solution) = request.body

      for {
        saved <- tableDefs.futureInsertCompleteUserSolution(
          exerciseId,
          maybeUsername.getOrElse(request.username),
          Tree.flattenTree(solution, SolutionNode.flattenSolutionNode)
        )
      } yield Ok(Json.toJson(saved))
    }

  def correctionValues(exerciseId: Int, username: String): Action[AnyContent] = jwtAuthenticatedAction.async { implicit request =>
    for {
      sampleSolution <- tableDefs.loadSampleSolution(exerciseId)
      userSolution   <- tableDefs.loadUserSolution(exerciseId, username)
    } yield Ok(Json.toJson(CorrectionValues(sampleSolution, userSolution))(Solution.correctionValuesJsonFormat))
  }

  def readDocument: Action[MultipartFormData[Files.TemporaryFile]] = jwtAuthenticatedAction(parse.multipartFormData) { implicit request =>
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
