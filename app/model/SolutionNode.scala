package model

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.ParagraphExtractor
import sangria.schema._

trait SolutionNode {
  def id: Int
  def childIndex: Int
  def isSubText: Boolean
  def text: String
  def applicability: Applicability
  def focusIntensity: Option[Importance]
  def parentId: Option[Int]

  lazy val paragraphCitationLocations = ParagraphExtractor.extractFrom(text)
}

object SolutionNode {
  def unapply(sn: SolutionNode): Some[(Int, Int, Boolean, String, Applicability, Option[Importance], Option[Int])] =
    Some(sn.id, sn.childIndex, sn.isSubText, sn.text, sn.applicability, sn.focusIntensity, sn.parentId)

  val interfaceType: InterfaceType[GraphQLContext, SolutionNode] = InterfaceType(
    "SolutionNode",
    fields[GraphQLContext, SolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("isSubText", BooleanType, resolve = _.value.isSubText),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLType, resolve = _.value.applicability),
      Field("focusIntensity", OptionType(Importance.graphQLType), resolve = _.value.focusIntensity),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId),
      Field("paragraphCitationLocations", ListType(ParagraphCitationLocation.queryType), resolve = _.value.paragraphCitationLocations)
    )
  )
}
