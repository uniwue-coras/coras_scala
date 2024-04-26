package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionNodeMutations extends GraphQLBasics:

  private val resolveMatchWithSampleNode: Resolver[UserSolutionNode, DbSolutionNodeMatch] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
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

  private val resolveDeleteMatch: Resolver[UserSolutionNode, Boolean] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      val sampleSolutionNodeId = args.arg(sampleSolutionNodeIdArgument)

      for {
        _ <- tableDefs.futureDeleteMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId)
      } yield true
  }

  private val resolveMatch: Resolver[UserSolutionNode, Option[DbSolutionNodeMatch]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      tableDefs.futureSelectMatch(username, exerciseId, args.arg(sampleSolutionNodeIdArgument), userSolutionNodeId)
  }

  private val resolveAnnotation: Resolver[UserSolutionNode, Option[DbAnnotation]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _), args) =>
      tableDefs.futureMaybeAnnotationById(username, exerciseId, userSolutionNodeId, args.arg(annotationIdArgument))
  }

  private val resolveUpsertAnnotation: Resolver[UserSolutionNode, DbAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _), args) =>
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
      Field("submitMatch", DbSolutionNodeMatch.queryType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatchWithSampleNode),
      Field("deleteMatch", BooleanType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveDeleteMatch),
      Field("match", OptionType(DbSolutionNodeMatch.mutationType), arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatch),
      // annotations
      Field("upsertAnnotation", Annotation.queryType, arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil, resolve = resolveUpsertAnnotation),
      Field("annotation", OptionType(Annotation.mutationType), arguments = annotationIdArgument :: Nil, resolve = resolveAnnotation)
    )
  )
