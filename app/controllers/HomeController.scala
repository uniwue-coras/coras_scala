package controllers

import better.files.FileExtensions
import model._
import model.graphql._
import model.lti.BasicLtiLaunchRequest
import model.matching.{NodeMatchingResult, TreeMatcher}
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
  tableDefs: TableDefs,
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
            val userContext = GraphQLContext(tableDefs, mongoQueries, maybeUser)

            Executor
              .execute(schema, queryAst, userContext = userContext, operationName = operationName, variables = variables.getOrElse(Json.obj()))
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

  def newCorrection(exerciseId: Int, username: String): Action[AnyContent] = Action.async { _ =>
    implicit val x: OFormat[NodeMatchingResult] = NodeMatchingResult.nodeMatchingResultFormat
    implicit val x1: OFormat[FlatSolutionNode]  = NodeMatchingResult.flatSolutionNodeJsonFormat

    for {
      maybeExercise <- tableDefs.futureMaybeExerciseById(exerciseId)

      sampleSolution = maybeExercise.map { exercise => SolutionTree.flattenTree(exercise.sampleSolution) }

      maybeUserSolution <- tableDefs.futureUserSolutionForExercise(exerciseId, username)

      userSolution = maybeUserSolution.map { userSolution => SolutionTree.flattenTree(userSolution.solution) }

      maybeSolutions = sampleSolution zip userSolution

      correction = maybeSolutions.map { case (sample: Seq[FlatSolutionNode], user: Seq[FlatSolutionNode]) =>
        val correction = TreeMatcher.performMatching(sample, user)

        Json.obj(
          "sampleSolution" -> Json.toJson(sample),
          "userSolution"   -> Json.toJson(user),
          "correction"     -> correction
        )

      }

    } yield Ok(Json.toJson(correction))

  }

  def ltiLogin: Action[BasicLtiLaunchRequest] = Action.async(parse.form(BasicLtiLaunchRequest.form)) { request =>
    val username = request.body.extUserUsername

    for {
      maybeUser <- tableDefs.futureMaybeUserByUsername(username)

      rights = maybeUser.map(_.rights).getOrElse(Rights.Student)

      uuid = UUID.randomUUID().toString

      loginResult = LoginResult(username, rights, generateJwt(username))

      _ = jwtsToClaim.put(uuid, loginResult)

    } yield Redirect(s"/lti/$uuid").withNewSession
  }

}
