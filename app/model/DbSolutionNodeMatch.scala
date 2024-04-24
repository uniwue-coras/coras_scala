package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ObjectType, fields, interfaces}

import scala.concurrent.ExecutionContext

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double] = None
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch]:
  override def exportData: ExportedSolutionNodeMatch =
    ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, paragraphCitationCorrectness, explanationCorrectness, certainty)

object DbSolutionNodeMatch extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    Nil
  )

  private val resolveUpdateParagraphCitationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateParagraphCitationCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness

  }

  private val resolveUpdateExplanationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateExplanationCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness

  }

  val mutationType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatchMutations",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field(
        "updateParagraphCitationCorrectness",
        Correctness.graphQLType,
        arguments = newCorrectnessArg :: Nil,
        resolve = resolveUpdateParagraphCitationCorrectness
      ),
      Field("updateExplanationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateExplanationCorrectness)
    )
  )
