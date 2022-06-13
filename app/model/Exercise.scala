package model

import com.scalatsi.{TSIType, TSType}
import model.graphql.{GraphQLArguments, GraphQLContext, SubmitSolutionInput, UserFacingGraphQLError}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.util.{Failure, Success}

final case class Exercise(
  id: Int,
  title: String,
  text: String
)

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNodeInput]
)

final case class NewExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNode]
)

object NewExerciseInput {

  val jsonFormat: OFormat[NewExerciseInput] = {
    implicit val x0: OFormat[SolutionNode] = SolutionNode.jsonFormat

    Json.format
  }

  val tsType: TSIType[NewExerciseInput] = {
    implicit val x0: TSIType[SolutionNode] = SolutionNode.tsType

    TSType.fromCaseClass
  }

}

object ExerciseGraphQLModel extends GraphQLArguments {

  private implicit val ec: ExecutionContextExecutor = ExecutionContext.global

  private def withUser[Val, T](context: Context[GraphQLContext, Val])(f: User => Future[T]): Future[T] = context.ctx.user match {
    case None       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
    case Some(user) => f(user)
  }

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields(
      Field(
        "sampleSolution",
        ListType(FlatSolutionNode.queryType),
        resolve = context => context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
      ),
      Field(
        "solutionForUser",
        ListType(FlatSolutionNode.queryType),
        arguments = usernameArg :: Nil,
        resolve = { case Context(value, ctx, args, _, _, _, _, _, _, _, _, _, _, _) =>
          ctx.tableDefs.futureUserSolutionForExercise(value.id, args.arg(usernameArg))
        }
      ),
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve =
          context => withUser(context) { case User(username, _, _, _) => context.ctx.tableDefs.futureUserHasSubmittedSolution(context.value.id, username) }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = context =>
          context.ctx.resolveAdmin match {
            case Failure(exception) => Future.failed(exception)
            case Success(_)         => context.ctx.tableDefs.futureUsersWithSolution(context.value.id)
          }
      )
    )
  )

  val mutationsType: ObjectType[GraphQLContext, Exercise] = ObjectType[GraphQLContext, Exercise](
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field(
        "submitSolution",
        BooleanType,
        arguments = solutionArg :: Nil,
        resolve = context =>
          withUser(context) {
            case User(loggedInUsername, _, rights, _) if rights != Rights.Student =>
              context.arg(solutionArg) match {
                case SubmitSolutionInput(maybeSubmittedUsername, solution) =>
                  for {
                    // Create user if not exists
                    _ <- maybeSubmittedUsername match {
                      case None => Future.successful(())
                      case Some(username) =>
                        for {
                          userExists <- context.ctx.tableDefs.futureMaybeUserByName(username).map(_.isDefined)
                          userInserted <-
                            if (userExists) {
                              Future.successful(true)
                            } else {
                              context.ctx.tableDefs.futureInsertUser(User(username, None, Rights.Student, None))
                            }
                        } yield userInserted
                    }
                    solutionInserted <- context.ctx.tableDefs
                      .futureInsertCompleteSolution(context.value.id, maybeSubmittedUsername.getOrElse(loggedInUsername), solution)
                  } yield solutionInserted
              }
            case _ => Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
          }
      ),
      Field(
        "userSolutionMutations",
        UserSolution.mutationType,
        arguments = usernameArg :: Nil,
        resolve = context =>
          withUser(context) { case User(_, _, rights, _) =>
            if (rights == Rights.Admin) {
              Future.successful(UserSolution(context.value.id, context.arg(usernameArg)))
            } else {
              Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
            }
          }
      )
    )
  )

  val inputType: InputObjectType[ExerciseInput] = {
    implicit val x: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNode.inputType

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[ExerciseInput] = {
    implicit val x: OFormat[FlatSolutionNodeInput] = FlatSolutionNode.inputJsonFormat

    Json.format
  }

}

trait ExerciseRepo {
  self: TableDefs =>

  import profile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureExercisesByIds(ids: Seq[Int]): Future[Seq[Exercise]] = db.run(exercisesTQ.filter(_.id inSet ids).result)

  def futureExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter(_.id === id).result.headOption)

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def text = column[String]("text")

    override def * = (id, title, text) <> (Exercise.tupled, Exercise.unapply)

  }

}
