package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.nodeMatching.{AnnotatedSolutionNode, SolutionNodeMatchExplanation, TreeMatcher}
import model.matching.{Match, MatchingResult, SpacyWordAnnotator}
import sangria.schema._

object UserSolutionNodeMutations extends GraphQLBasics {

  private val resolveSubmitMatch: Resolver[UserSolutionNode, Seq[SolutionNodeMatch]] = unpackedResolverWithArgs {
    case (ws, tableDefs, _ec, UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _, _), args) =>
      implicit val ec  = _ec
      val sampleNodeId = args.arg(sampleNodeIdArg)

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
    case (_, tableDefs, _, UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _, _), args) =>
      tableDefs.futureSelectMatch(SolutionNodeMatchKey(exerciseId, username, args.arg(sampleNodeIdArg), userSolutionNodeId))
  }

  private val resolveAnnotation: Resolver[UserSolutionNode, Option[Annotation]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _, _), args) =>
      tableDefs.futureSelectAnnotation(AnnotationKey(username, exerciseId, userSolutionNodeId, args.arg(annotationIdArg)))
  }

  private val resolveSubmitAnnotation: Resolver[UserSolutionNode, Annotation] = unpackedResolverWithArgs {
    case (_, tableDefs, _, UserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _, _), args) =>
      tableDefs.futureInsertAnnotation(username, exerciseId, nodeId, args.arg(annotationArgument))
  }

  val mutationType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType(
    "UserSolutionNodeMutations",
    fields[GraphQLContext, UserSolutionNode](
      // matches
      Field("submitMatch", ListType(SolutionNodeMatch.queryType), arguments = sampleNodeIdArg :: Nil, resolve = resolveSubmitMatch),
      Field("match", OptionType(SolutionNodeMatch.mutationType), arguments = sampleNodeIdArg :: Nil, resolve = resolveMatch),
      Field("submitAnnotation", Annotation.queryType, arguments = annotationArgument :: Nil, resolve = resolveSubmitAnnotation),
      Field("annotation", OptionType(Annotation.mutationType), arguments = annotationIdArg :: Nil, resolve = resolveAnnotation)
    )
  )
}
