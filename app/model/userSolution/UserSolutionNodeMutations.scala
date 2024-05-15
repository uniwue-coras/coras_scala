package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.nodeMatching.{AnnotatedSolutionNode, SolutionNodeMatchExplanation, TreeMatcher}
import model.matching.{Match, MatchingResult, SpacyWordAnnotator}
import sangria.schema._

import scala.concurrent.Future

object UserSolutionNodeMutations extends GraphQLBasics {

  private val resolveSubmitMatch: Resolver[UserSolutionNode, Seq[SolutionNodeMatch]] = unpackedResolverWithArgs {
    case (GraphQLContext(ws, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _), args) =>
      implicit val ec  = _ec
      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)

      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        annotator = new SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content }.filter { _.nonEmpty })

        sampleSubTreeNodes <- tableDefs.futureSelectSampleSubTree(exerciseId, sampleNodeId)
        userSubTreeNodes   <- tableDefs.futureSelectUserSubTree(username, exerciseId, userNodeId)

        sampleSubTree <- annotator.buildSampleSolutionTree(sampleSubTreeNodes)
        userSubTree   <- annotator.buildUserSolutionTree(userSubTreeNodes)

        MatchingResult(subMatches, _, _) = TreeMatcher.matchContainerTrees(
          sampleSubTree,
          userSubTree,
          Some((sampleNodeId, userNodeId))
        )

        allMatches = Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation](sampleSubTree.nodes.head, userSubTree.nodes.head, None) +: subMatches

        correctionResult = allMatches.map { m => GeneratedSolutionNodeMatch.fromSolutionNodeMatch(exerciseId, username, m)(sampleSubTree, userSubTree) }

        _ <- tableDefs.futureInsertCorrectionResult(correctionResult)
      } yield correctionResult
  }

  private val resolveMatch: Resolver[UserSolutionNode, Option[DbSolutionNodeMatch]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      tableDefs.futureSelectMatch(SolutionNodeMatchKey(exerciseId, username, args.arg(sampleSolutionNodeIdArgument), userSolutionNodeId))
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
      Field("submitMatch", ListType(SolutionNodeMatch.queryType), arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveSubmitMatch),
      Field("match", OptionType(SolutionNodeMatch.mutationType), arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatch),
      Field(
        // TODO: split in insertAnnotation & annotation->edit?
        "upsertAnnotation",
        Annotation.queryType,
        arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil,
        resolve = resolveUpsertAnnotation,
        deprecationReason = Some("will be eventually split in insert & update!")
      ),
      Field("annotation", OptionType(Annotation.mutationType), arguments = annotationIdArgument :: Nil, resolve = resolveAnnotation)
    )
  )
}
