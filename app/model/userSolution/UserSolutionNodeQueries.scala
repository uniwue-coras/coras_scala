package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.ExecutionContext

object UserSolutionNodeQueries extends GraphQLBasics:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val annoTextRecommendArgs = startIndexArgument :: endIndexArgument :: Nil

  private val resolveAnnotations: Resolver[UserSolutionNode, Seq[Annotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, id, _, _, _, _, _)) =>
      tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)
  }

  private val resolvePragraphCitationAnnotations: Resolver[UserSolutionNode, Seq[ParagraphCitationAnnotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, id, _, _, _, _, _)) =>
      tableDefs.futureSelectParagraphCitationAnnotationsForUserNode(exerciseId, username, id)
  }

  private val resolveAnnotationTextRecommendations: Resolver[UserSolutionNode, Seq[String]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, text, _, _), args) =>
      val markedText = text.substring(args.arg(startIndexArgument), args.arg(endIndexArgument))

      for {
        annotationRecommendations <- tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

        texts = annotationRecommendations
          .sortBy { case (annotation, nodeText) => levenshteinDistance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
          .map { case (annotation, _) => annotation.text }
      } yield texts
  }

  val queryType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType[GraphQLContext, UserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, UserSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, UserSolutionNode](
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations),
      Field("annotationTextRecommendations", ListType(StringType), arguments = annoTextRecommendArgs, resolve = resolveAnnotationTextRecommendations),
      Field("paragraphCitationAnnotations", ListType(ParagraphCitationAnnotation.queryType), resolve = resolvePragraphCitationAnnotations)
    )
  )
