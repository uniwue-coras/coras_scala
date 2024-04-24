package model

import model.exporting.{ExportedExercise, NodeExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.SpacyWordAnnotator
import model.matching.nodeMatching.AnnotatedSampleSolutionTree
import model.userSolution.{UserSolution, UserSolutionInput, UserSolutionMutations, UserSolutionQueries}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class Exercise(
  id: Int,
  title: String,
  text: String
) extends NodeExportable[ExportedExercise]:
  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = for {
    sampleSolutionNodes   <- tableDefs.futureAllSampleSolNodesForExercise(id)
    userSolutionNodes     <- tableDefs.futureUserSolutionsForExercise(id)
    exportedUserSolutions <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }
    exportedSampleSolutionNodes = sampleSolutionNodes.map { _.exportData }
  } yield ExportedExercise(id, title, text, exportedSampleSolutionNodes, exportedUserSolutions)

object Exercise extends GraphQLBasics:

  // Queries

  private val resolveSampleSolution: Resolver[Exercise, Seq[SampleSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureAllSampleSolNodesForExercise(context.value.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionsForExercise(context.value.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureMaybeUserSolution(context.arg(usernameArg), context.value.id)
  }

  val queryType = ObjectType[GraphQLContext, Exercise](
    "Exercise",
    fields[GraphQLContext, Exercise](
      Field("id", IntType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title),
      Field("text", StringType, resolve = _.value.text),
      Field("sampleSolution", ListType(SampleSolutionNode.queryType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionQueries.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionQueries.queryType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    implicit val ec = context.ctx.ec

    val UserSolutionInput(username, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(username, context.value.id, flatSolution)
    } yield true
  }

  private val resolveRecalculateAllCorrectnesses: Resolver[Exercise, Boolean] = resolveWithAdmin { (context, _) =>
    val GraphQLContext(ws, tableDefs, _, _ec) = context.ctx
    implicit val ec                           = _ec
    val exerciseId                            = context.value.id

    for {
      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      wordAnnotator = SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

      sampleNodes                                    <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      sampleTree @ given AnnotatedSampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleNodes)
      userSolutions                                  <- tableDefs.futureUserSolutionsForExercise(exerciseId)

      completeUpdateData <- Future.traverse(userSolutions) { userSol => userSol.recalculateCorrectness(tableDefs, wordAnnotator) }

      _ <- tableDefs.futureUpdateCorrectness(completeUpdateData.flatten)
    } yield true
  }

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionMutations.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution),
      Field("recalculateAllCorrectnesses", BooleanType, resolve = resolveRecalculateAllCorrectnesses)
    )
  )
