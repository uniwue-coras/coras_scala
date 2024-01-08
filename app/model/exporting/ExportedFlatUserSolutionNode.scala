package model.exporting

import model.graphql.GraphQLContext
import model.{Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  annotations: Seq[ExportedAnnotation]
) extends SolutionNode:
  override def resolveSubTexts(context: GraphQLContext): Future[Seq[String]] = ???

object ExportedFlatUserSolutionNode:
  val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    implicit val exportedAnnotationJsonFormat: OFormat[ExportedAnnotation] = Json.format

    Json.format
  }
