package model

import model.exporting.{ExportedExercise, NodeExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.SpacyWordAnnotator
import model.userSolution.{UserSolution, UserSolutionInput, UserSolutionMutations, UserSolutionQueries}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class Exercise(
  id: Int,
  title: String,
  text: String
) extends NodeExportable[ExportedExercise] {
  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = for {
    sampleSolutionNodes   <- tableDefs.futureAllSampleSolNodesForExercise(id)
    userSolutionNodes     <- tableDefs.futureUserSolutionsForExercise(id)
    exportedUserSolutions <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }
    exportedSampleSolutionNodes = sampleSolutionNodes.map { _.exportData }
  } yield ExportedExercise(id, title, exportedSampleSolutionNodes, exportedUserSolutions)
}

object Exercise extends GraphQLBasics {

  // Queries

  private val resolveSampleSolution: Resolver[Exercise, Seq[SampleSolutionNode]] = unpackedResolverWithUser {
    case (GraphQLContext(_, tableDefs, _, _), exercise, _, _) => tableDefs.futureAllSampleSolNodesForExercise(exercise.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = unpackedResolverWithCorrector {
    case (GraphQLContext(_, tableDefs, _, _), exercise, _, _) => tableDefs.futureUserSolutionsForExercise(exercise.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = unpackedResolverWithCorrector {
    case (GraphQLContext(_, tableDefs, _, _), exercise, _, args) => tableDefs.futureMaybeUserSolution(args.arg(usernameArg), exercise.id)
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

  private val resolveSubmitSolution: Resolver[Exercise, Option[UserSolution]] = unpackedResolverWithUser {
    case (GraphQLContext(_, tableDefs, _, _ec), exercise, _, args) =>
      implicit val ec = _ec

      val UserSolutionInput(username, flatSolution) = args.arg(userSolutionInputArg)

      for {
        maybeExistingSolution <- tableDefs.futureMaybeUserSolution(username, exercise.id)

        newSolution <- maybeExistingSolution match {
          case Some(_) => Future.successful(None)
          case None =>
            for {
              solution <- tableDefs.futureInsertUserSolutionForExercise(username, exercise.id, flatSolution)
            } yield Some(solution)
        }
      } yield newSolution
  }

  private val resolveRecalculateAllCorrectnesses: Resolver[Exercise, Boolean] = unpackedResolverWithAdmin {
    case (GraphQLContext(ws, tableDefs, _, _ec), exercise, _, _) =>
      implicit val ec = _ec

      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = new SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

        sampleNodes   <- tableDefs.futureAllSampleSolNodesForExercise(exercise.id)
        sampleTree    <- wordAnnotator.buildSampleSolutionTree(sampleNodes)
        userSolutions <- tableDefs.futureUserSolutionsForExercise(exercise.id)

        completeUpdateData <- Future.traverse(userSolutions) { userSol =>
          userSol.recalculateCorrectness(tableDefs, wordAnnotator)(sampleTree, _ec)
        }

        (correctnessUpdateData, paragraphCitationAnnotations) = completeUpdateData.flatten.foldLeft(
          Seq[(DbSolutionNodeMatch, (Correctness, Correctness))](),
          Seq[DbParagraphCitationAnnotation]()
        ) { case ((corrUpdateAcc, parCitAnnoAcc), (solNodeMatch, (parCitCorrectness, explCorrectness, parCitAnnos))) =>
          (
            corrUpdateAcc :+ (solNodeMatch -> (parCitCorrectness, explCorrectness)),
            parCitAnnoAcc ++ parCitAnnos
          )
        }

        _ <- tableDefs.futureUpdateCorrectness(correctnessUpdateData)
        _ <- tableDefs.futureUpsertParagraphCitationAnnotations(paragraphCitationAnnotations)
      } yield true
  }

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", OptionType(UserSolutionQueries.queryType), arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionMutations.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution),
      Field("recalculateAllCorrectnesses", BooleanType, resolve = resolveRecalculateAllCorrectnesses)
    )
  )

}
