package model

import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import model.matching.WordAnnotator
import model.matching.nodeMatching.{AnnotatedSolutionNodeMatcher, SolutionNodeMatchExplanation, SolutionTree}
import sangria.schema._

import scala.concurrent.Future

object UserSolutionNodeQueries extends GraphQLBasics:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val resolvePreviewMatchAgainst: Resolver[UserSolutionNode, DefaultSolutionNodeMatch] = unpackedResolverWithArgs {
    case (GraphQLContext(tableDefs, _, _ec), userNode, args) =>
      implicit val ec  = _ec
      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)

      for {
        maybeSampleNode <- tableDefs.futureSampleSolutionNodeForExercise(userNode.exerciseId, sampleNodeId)

        sampleNode <- maybeSampleNode match
          case None       => Future.failed(UserFacingGraphQLError("Could not find sample solution node..."))
          case Some(node) => Future.successful(node)

        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

        annotatedSampleNode = wordAnnotator.annotateNode(sampleNode)
        annotatedUserNode   = wordAnnotator.annotateNode(userNode)

        maybeExplanation =
          if sampleNode.text == userNode.text then None
          else Some(AnnotatedSolutionNodeMatcher.generateFuzzyMatchExplanation(annotatedSampleNode, annotatedUserNode))

      } yield DefaultSolutionNodeMatch(sampleNode.id, userNode.id, maybeExplanation)
  }

  private val resolveAnnotations: Resolver[UserSolutionNode, Seq[DbAnnotation]] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _), UserSolutionNode(username, exerciseId, id, _, _, _, _, _)) =>
      tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)
  }

  private val resolveAnnotationTextRecommendations: Resolver[UserSolutionNode, Seq[String]] = unpackedResolverWithArgs {
    case (GraphQLContext(tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, text, _, _), args) =>
      implicit val ec = _ec

      val markedText = text.substring(args.arg(startIndexArgument), args.arg(endIndexArgument))

      for {
        annotationRecommendations <- tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

        texts = annotationRecommendations
          .sortBy { case (annotation, nodeText) => levenshteinDistance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
          .map { case (annotation, _) => annotation.text }
      } yield texts
  }

  private val resolveAddAnntationPreviewMatch: Resolver[UserSolutionNode, Seq[SolutionNodeMatchExplanation]] = unpackedResolverWithArgs {
    case (GraphQLContext(tableDefs, _, _ec), UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _), args) =>
      implicit val ec = _ec

      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)

      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

        sampleSubTreeNodes <- tableDefs.futureSelectSampleSubTree(exerciseId, sampleNodeId)
        userSubTreeNodes   <- tableDefs.futureSelectUserSubTree(username, exerciseId, userNodeId)

        sampleSubTree = SolutionTree.buildWithAnnotator(wordAnnotator, sampleSubTreeNodes)
        userSubTree   = SolutionTree.buildWithAnnotator(wordAnnotator, userSubTreeNodes)

        // TODO: match sub trees!
        x = AnnotatedSolutionNodeMatcher.generateFuzzyMatchExplanation(sampleSubTree.nodes.head, userSubTree.nodes.head)

      } yield Seq(x)
  }

  val queryType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType[GraphQLContext, UserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, UserSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, UserSolutionNode](
      Field("previewMatchAgainst", DefaultSolutionNodeMatch.queryType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolvePreviewMatchAgainst),
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations),
      Field(
        "annotationTextRecommendations",
        ListType(StringType),
        arguments = startIndexArgument :: endIndexArgument :: Nil,
        resolve = resolveAnnotationTextRecommendations
      ),
      Field(
        "addAnnotationPreviewMatch",
        ListType(SolutionNodeMatchExplanation.queryType),
        arguments = sampleSolutionNodeIdArgument :: Nil,
        resolve = resolveAddAnntationPreviewMatch
      )
    )
  )
