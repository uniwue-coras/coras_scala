package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ObjectType, fields}

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double] = None,
  matchStatus: MatchStatus = MatchStatus.Automatic
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch] {
  override def exportData: ExportedSolutionNodeMatch =
    ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, paragraphCitationCorrectness, explanationCorrectness, certainty)
}

object DbSolutionNodeMatch extends GraphQLBasics {
  private val resolveUpdateParCitCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateParCitCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness
  }

  private val resolveUpdateExplanationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateExplanationCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness
  }

  val mutationType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatchMutations",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("updateParagraphCitationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateParCitCorrectness),
      Field("updateExplanationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateExplanationCorrectness)
    )
  )
}
