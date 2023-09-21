package model

import de.uniwue.ls6.model.ExportedExercise
import model.graphql.GraphQLArguments.{userSolutionInputArg, usernameArg}
import model.graphql._
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema.{BooleanType, Field, InputObjectType, ListType, ObjectType, OptionType, fields}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNodeInput]
)

final case class Exercise(
  id: Int,
  title: String,
  text: String
) extends NodeExportable[ExportedExercise] {

  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = for {
    sampleSolutionNodes <- tableDefs.futureSampleSolutionForExercise(id)

    exportedSampleSolutionNodes = sampleSolutionNodes.map { _.exportData }

    userSolutionNodes <- tableDefs.futureUserSolutionsForExercise(id)

    exportedUserSolutions <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

  } yield ExportedExercise(id, title, text, exportedSampleSolutionNodes, exportedUserSolutions)

}

object ExerciseGraphQLTypes extends QueryType[Exercise] with MutationType[Exercise] with MyInputType[ExerciseInput] {

  override val inputType: InputObjectType[ExerciseInput] = {
    @unused implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeInputGraphQLTypes.inputType

    deriveInputObjectType[ExerciseInput]()
  }

  // Queries

  private val resolveSampleSolution: Resolver[Exercise, Seq[FlatSampleSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionsForExercise(context.value.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureMaybeUserSolution(context.arg(usernameArg), context.value.id)
  }

  override val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields[GraphQLContext, Exercise](
      Field("sampleSolution", ListType(FlatSampleSolutionNodeGraphQLTypes.queryType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionGraphQLTypes.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.queryType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    @unused implicit val ec: ExecutionContext     = context.ctx.ec
    val UserSolutionInput(username, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(username, context.value.id, flatSolution)
    } yield true
  }

  override val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

}

trait ExerciseRepository {
  self: TableDefs =>

  import profile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureMaybeExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter { _.id === id }.result.headOption)

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {
    def id    = column[Int]("id", O.PrimaryKey, O.AutoInc)
    def title = column[String]("title", O.Unique)
    def text  = column[String]("text")

    override def * = (id, title, text) <> (Exercise.tupled, Exercise.unapply)
  }

}
