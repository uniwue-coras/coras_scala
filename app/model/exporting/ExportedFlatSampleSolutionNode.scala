package model.exporting

import model.graphql.GraphQLContext
import model.{Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

final case class ExportedFlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode:
  override def resolveSubTexts(context: GraphQLContext): Future[Seq[String]] = ???

object ExportedFlatSampleSolutionNode:
  val jsonFormat: OFormat[ExportedFlatSampleSolutionNode] = Json.format
