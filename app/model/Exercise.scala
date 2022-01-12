package model

import model.graphql.{GraphQLArguments, GraphQLContext, UserFacingGraphQLError}
import model.solution_entry.{FlatSolutionEntry, FlatSolutionEntryInput}
import play.api.db.slick.HasDatabaseConfigProvider
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._
import slick.jdbc.JdbcProfile

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
      Field("sampleSolution", ListType(FlatSolutionEntry.queryType), resolve = _ => Seq(???)),
      Field("solutionForUser", ListType(ListType(FlatSolutionEntry.queryType)), arguments = usernameArg :: Nil, resolve = _ => Seq(Seq(???))),
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = context =>
          context.ctx.user match {
            case None                          => Failure(UserFacingGraphQLError("User is not logged in!"))
            case Some(User(username, _, _, _)) => Success(false) /* FIXME: ??? */
          }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = context =>
          context.ctx.resolveAdmin.map { _ =>
            Seq.empty /* FIXME: ??? */
          }
      )
    )
  )

  val mutationsType: ObjectType[GraphQLContext, Exercise] = ObjectType[GraphQLContext, Exercise](
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolutionForUser", BooleanType, arguments = usernameArg :: solutionArg :: Nil, resolve = _ => ???),
      Field("submitUserSolution", BooleanType, arguments = solutionArg :: Nil, resolve = _ => ???),
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
  self: HasDatabaseConfigProvider[JdbcProfile] =>

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
