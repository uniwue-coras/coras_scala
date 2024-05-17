package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

final case class SampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  focusIntensity: Option[Importance],
  parentId: Option[Int]
) extends SolutionNode

object SampleSolutionNode extends GraphQLBasics {

  def fromInput(exerciseId: Int): (SolutionNodeInput) => SampleSolutionNode = {
    case SolutionNodeInput(nodeId, childIndex, text, applicability, subText, focusIntensity, parentId) =>
      SampleSolutionNode(exerciseId, nodeId, childIndex, text, applicability, subText, focusIntensity, parentId)
  }

  private val resolveSubTexts: Resolver[SampleSolutionNode, Seq[String]] = unpackedResolver { case (_, tableDefs, _ec, sampleSolNode) =>
    implicit val ec = _ec

    for {
      subTextNodes <- tableDefs.futureSubTextNodesForSampleSolNode(sampleSolNode.exerciseId, sampleSolNode.id)
    } yield subTextNodes.map(_.text)
  }

  val queryType: ObjectType[GraphQLContext, SampleSolutionNode] = ObjectType[GraphQLContext, SampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, SampleSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, SampleSolutionNode](
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts)
    )
  )
}
