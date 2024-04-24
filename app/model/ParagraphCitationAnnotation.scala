package model

import model.graphql.GraphQLContext
import sangria.schema._

trait ParagraphCitationAnnotation:
  def sampleNodeId: Int
  def userNodeId: Int
  def awaitedParagraph: String
  def citedParagraph: Option[String]

final case class DbParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  citedParagraph: Option[String]
) extends ParagraphCitationAnnotation

object DbParagraphCitationAnnotation:

  val interfaceType: InterfaceType[GraphQLContext, ParagraphCitationAnnotation] = InterfaceType(
    "IParagraphCitationAnnotation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("awaitedParagraph", StringType, resolve = _.value.awaitedParagraph),
      Field("citedParagraph", OptionType(StringType), resolve = _.value.citedParagraph)
    )
  )
  val queryType: ObjectType[GraphQLContext, DbParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotation",
    interfaces(interfaceType),
    Nil
  )
