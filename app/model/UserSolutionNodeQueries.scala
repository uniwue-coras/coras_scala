package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.nodeMatching.{AnnotatedSolutionNodeMatcher, TreeMatcher}
import model.matching.{Match, SpacyWordAnnotator}
import sangria.schema._

object UserSolutionNodeQueries extends GraphQLBasics:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val annoTextRecommendArgs = startIndexArgument :: endIndexArgument :: Nil

  private val resolveAnnotations: Resolver[UserSolutionNode, Seq[DbAnnotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, id, _, _, _, _, _)) =>
      tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)
  }

  private val resolveAnnotationTextRecommendations: Resolver[UserSolutionNode, Seq[String]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, text, _, _), args) =>
      implicit val ec = _ec

      val markedText = text.substring(args.arg(startIndexArgument), args.arg(endIndexArgument))

      for {
        annotationRecommendations <- tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

        texts = annotationRecommendations
          .sortBy { case (annotation, nodeText) => levenshteinDistance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
          .map { case (annotation, _) => annotation.text }
      } yield texts
  }

  private val resolveAddAnntationPreviewMatch: Resolver[UserSolutionNode, CorrectionResult] = unpackedResolverWithArgs {
    case (GraphQLContext(ws, tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _), args) =>
      implicit val ec = _ec

      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)

      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

        sampleSubTreeNodes <- tableDefs.futureSelectSampleSubTree(exerciseId, sampleNodeId)
        userSubTreeNodes   <- tableDefs.futureSelectUserSubTree(username, exerciseId, userNodeId)

        sampleSubTree <- wordAnnotator.buildSolutionTree(sampleSubTreeNodes)
        userSubTree   <- wordAnnotator.buildSolutionTree(userSubTreeNodes)

        maybeExplanation = AnnotatedSolutionNodeMatcher(sampleSubTree, userSubTree).explainIfNotCorrect(sampleSubTree.nodes.head, userSubTree.nodes.head)

        submittedMatch = DefaultSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation)

        mr = TreeMatcher.matchContainerTrees(sampleSubTree, userSubTree, Some((sampleNodeId, userNodeId)))

        allMatches = submittedMatch +: mr.matches.map { DefaultSolutionNodeMatch.fromSolutionNodeMatch }

        annotationGenerator = DbAnnotationGenerator(wordAnnotator, sampleSubTree, userSubTree, username, exerciseId, tableDefs)

        annotations <- annotationGenerator.generateAnnotations(allMatches)

      } yield CorrectionResult(allMatches, annotations)
  }

  val queryType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType[GraphQLContext, UserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, UserSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, UserSolutionNode](
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations),
      Field("annotationTextRecommendations", ListType(StringType), arguments = annoTextRecommendArgs, resolve = resolveAnnotationTextRecommendations),
      Field("addAnnotationPreviewMatch", CorrectionResult.queryType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveAddAnntationPreviewMatch)
    )
  )
