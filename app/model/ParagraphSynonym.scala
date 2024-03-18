package model

import model.graphql.GraphQLContext
import sangria.schema._

private trait IParagraphSynonymIdentifier:
  def paragraphType: String
  def paragraphNumber: String
  def section: Int
  def lawCode: String

final case class ParagraphSynonymIdentifier(
  paragraphType: String,
  paragraphNumber: String,
  section: Int,
  lawCode: String
) extends IParagraphSynonymIdentifier

object ParagraphSynonymIdentifier:
  val interfaceType = InterfaceType[GraphQLContext, IParagraphSynonymIdentifier](
    "IParagraphSynonymIdentifier",
    fields[GraphQLContext, IParagraphSynonymIdentifier](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("paragraphNumber", StringType, resolve = _.value.paragraphNumber),
      Field("section", IntType, resolve = _.value.section),
      Field("lawCode", StringType, resolve = _.value.lawCode)
    )
  )

  val queryType: ObjectType[GraphQLContext, ParagraphSynonymIdentifier] = ObjectType(
    "ParagraphSynonymIdentifier",
    interfaces(interfaceType),
    Nil
  )

final case class ParagraphSynonym(
  paragraphType: String,
  paragraphNumber: String,
  section: Int,
  sentenceNumber: Option[Int],
  lawCode: String,
  synonym: String
) extends IParagraphSynonymIdentifier

object ParagraphSynonym:
  def build(paragraphSynonymIdentifier: ParagraphSynonymIdentifier, maybeSentenceNumber: Option[Int], synonym: String) = paragraphSynonymIdentifier match
    case ParagraphSynonymIdentifier(paragraphType, paragraphNumber, section, lawCode) =>
      ParagraphSynonym(paragraphType, paragraphNumber, section, maybeSentenceNumber, lawCode, synonym)

  val queryType: ObjectType[GraphQLContext, ParagraphSynonym] = ObjectType(
    "ParagraphSynonym",
    interfaces(ParagraphSynonymIdentifier.interfaceType),
    fields[GraphQLContext, ParagraphSynonym](
      Field("sentenceNumber", OptionType(IntType), resolve = _.value.sentenceNumber),
      Field("synonym", StringType, resolve = _.value.synonym)
    )
  )
