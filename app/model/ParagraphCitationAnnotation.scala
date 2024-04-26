package model

import model.graphql.GraphQLContext
import sangria.schema._

trait ParagraphCitationAnnotation {
  def sampleNodeId: Int
  def userNodeId: Int
  def awaitedParagraph: String
  def citedParagraph: Option[String]
}

object ParagraphCitationAnnotation {
  val queryType: ObjectType[GraphQLContext, ParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("awaitedParagraph", StringType, resolve = _.value.awaitedParagraph),
      Field("citedParagraph", OptionType(StringType), resolve = _.value.citedParagraph)
    )
  )
}

final case class GeneratedParagraphCitationAnnotation(
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  citedParagraph: Option[String]
) extends ParagraphCitationAnnotation {
  def forDb(exerciseId: Int, username: String): DbParagraphCitationAnnotation =
    DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, citedParagraph)
}

final case class DbParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  citedParagraph: Option[String]
) extends ParagraphCitationAnnotation
