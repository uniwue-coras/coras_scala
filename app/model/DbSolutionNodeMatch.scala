package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.GraphQLContext
import model.graphql.GraphQLBasics
import sangria.schema.{ObjectType, interfaces, fields, Field}

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  correctness: Correctness,
  certainty: Option[Double] = None
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch]:
  override def exportData: ExportedSolutionNodeMatch = ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, correctness, certainty)

object DbSolutionNodeMatch extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    Nil
  )

  private val resolveUpdateCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _), args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateMatchCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness
  }

  val mutationType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatchMutations",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("updateCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateCorrectness)
    )
  )
