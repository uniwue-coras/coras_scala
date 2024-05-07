package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.Future

object UserSolutionNodeMutations extends GraphQLBasics {

  private val resolveMatchWithSampleNode: Resolver[UserSolutionNode, DbSolutionNodeMatch] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      implicit val ec          = _ec
      val sampleSolutionNodeId = args.arg(sampleSolutionNodeIdArgument)

      // TODO: calculate correctnesses
      val paragraphCitationCorrectness = Correctness.Unspecified
      val explanationCorrectness       = Correctness.Unspecified

      val newMatch = DbSolutionNodeMatch(
        username,
        exerciseId,
        sampleSolutionNodeId,
        userSolutionNodeId,
        paragraphCitationCorrectness,
        explanationCorrectness,
        certainty = None,
        matchStatus = MatchStatus.Manual
      )

      for {
        _ <- tableDefs.futureInsertMatch(newMatch)
      } yield newMatch
  }

  private val resolveMatch: Resolver[UserSolutionNode, Option[DbSolutionNodeMatch]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      tableDefs.futureSelectMatch(username, exerciseId, args.arg(sampleSolutionNodeIdArgument), userSolutionNodeId)
  }

  private val resolveSubmitParagraphCitationAnnotation: Resolver[UserSolutionNode, DbParagraphCitationAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _), args) =>
      implicit val ec  = _ec
      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)

      val ParagraphCitationAnnotationInput(awaitedParagraph, correctness, citedParagraph, explanation) = args.arg(paragraphCitationAnnotationInputArgument)

      val newParCitAnno =
        DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, correctness, citedParagraph, explanation)

      for {
        _ <- tableDefs.futureInsertParagraphCitationAnnotation(newParCitAnno)
      } yield newParCitAnno
  }

  private val resolveParagraphCitationAnnotation: Resolver[UserSolutionNode, Option[DbParagraphCitationAnnotation]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      val sampleNodeId     = args.arg(sampleSolutionNodeIdArgument)
      val awaitedParagraph = args.arg(awaitedParagraphArgument)

      tableDefs.futureSelectParagraphCitationAnnotation(
        ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userSolutionNodeId, awaitedParagraph)
      )
  }

  private val resolveAnnotation: Resolver[UserSolutionNode, Option[DbAnnotation]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      tableDefs.futureMaybeAnnotationById(username, exerciseId, userSolutionNodeId, args.arg(annotationIdArgument))
  }

  private val resolveUpsertAnnotation: Resolver[UserSolutionNode, DbAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _), args) =>
      implicit val ec                                                        = _ec
      val AnnotationInput(errorType, importance, startIndex, endIndex, text) = args.arg(annotationArgument)

      for {
        annotationId <- args.arg(maybeAnnotationIdArgument) match {
          case Some(id) => Future.successful(id)
          case None     => tableDefs.futureNextAnnotationId(username, exerciseId, nodeId)
        }

        annotation = DbAnnotation(username, exerciseId, nodeId, annotationId, errorType, importance, startIndex, endIndex, text, AnnotationType.Manual)

        _ <- tableDefs.futureUpsertAnnotation(annotation)
      } yield annotation
  }

  val mutationType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, UserSolutionNode](
      // matches
      Field("submitMatch", SolutionNodeMatch.queryType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatchWithSampleNode),
      Field("match", OptionType(SolutionNodeMatch.mutationType), arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatch),
      // annotations
      Field(
        "submitParagraphCitationAnnotation",
        ParagraphCitationAnnotation.queryType,
        arguments = sampleSolutionNodeIdArgument :: paragraphCitationAnnotationInputArgument :: Nil,
        resolve = resolveSubmitParagraphCitationAnnotation
      ),
      Field(
        "paragraphCitationAnnotation",
        OptionType(ParagraphCitationAnnotation.mutationType),
        arguments = sampleSolutionNodeIdArgument :: awaitedParagraphArgument :: Nil,
        resolve = resolveParagraphCitationAnnotation
      ),
      Field("upsertAnnotation", Annotation.queryType, arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil, resolve = resolveUpsertAnnotation),
      Field("annotation", OptionType(Annotation.mutationType), arguments = annotationIdArgument :: Nil, resolve = resolveAnnotation)
    )
  )
}
