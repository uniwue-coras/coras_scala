package model

import model.graphql.{GraphQLArguments, GraphQLContext, SubmitSolutionInput, UserFacingGraphQLError}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.concurrent.Future
import scala.util.{Failure, Success}

final case class Exercise(
  id: Int,
  title: String,
  text: String
)

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionEntryInput]
)

object ExerciseGraphQLModel extends GraphQLArguments {

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields(
      Field(
        "sampleSolution",
        ListType(FlatSolutionEntry.queryType),
        resolve = context => context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
      ),
      Field(
        "solutionForUser",
        ListType(FlatSolutionEntry.queryType),
        arguments = usernameArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))
      ),
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = context =>
          context.ctx.user match {
            case None                          => Future.failed(UserFacingGraphQLError("User is not logged in!"))
            case Some(User(username, _, _, _)) => context.ctx.tableDefs.futureUserHasSubmittedSolution(context.value.id, username)
          }
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
          context.ctx.user match {
            case Some(User(loggedInUsername, _, rights, _)) if rights != Rights.Student =>
              context.arg(solutionArg) match {
                case SubmitSolutionInput(maybeSubmittedUsername, solution) =>
                  context.ctx.tableDefs.futureInsertCompleteSolution(context.value.id, maybeSubmittedUsername.getOrElse(loggedInUsername), solution)
              }
            case _ => Failure(UserFacingGraphQLError("User is not logged in or has insufficient rights!"))
          }
      ),
      Field("userSolutionMutations", UserSolution.mutationType, arguments = usernameArg :: Nil, resolve = _ => ???)
    )
  )

  val inputType: InputObjectType[ExerciseInput] = {
    implicit val x: InputObjectType[FlatSolutionEntryInput] = FlatSolutionEntry.inputType

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[ExerciseInput] = {
    implicit val x: OFormat[FlatSolutionEntryInput] = FlatSolutionEntry.inputJsonFormat

    Json.format
  }

}

trait ExerciseRepo {
  self: TableDefs =>

  import profile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter(_.id === id).result.headOption)

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def text = column[String]("text")

    override def * = (id, title, text) <> (Exercise.tupled, Exercise.unapply)

  }

}
