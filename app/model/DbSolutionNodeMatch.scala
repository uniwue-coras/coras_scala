package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.GraphQLContext
import sangria.schema.{ObjectType, interfaces}

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch]:
  override def exportData: ExportedSolutionNodeMatch = ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, certainty)

object DbSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    Nil
  )
