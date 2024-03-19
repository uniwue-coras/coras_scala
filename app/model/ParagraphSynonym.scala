package model

import model.graphql.GraphQLContext
import sangria.schema._

private trait IParagraphSynonymIdentifier:
  def paragraphType: String
  def paragraph: String
  def subParagraph: Int
  def lawCode: String

final case class ParagraphSynonymIdentifier(
  paragraphType: String,
  paragraph: String,
  subParagraph: Int,
  lawCode: String
) extends IParagraphSynonymIdentifier

object ParagraphSynonymIdentifier:
  val interfaceType = InterfaceType[GraphQLContext, IParagraphSynonymIdentifier](
    "IParagraphSynonymIdentifier",
    fields[GraphQLContext, IParagraphSynonymIdentifier](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("paragraph", StringType, resolve = _.value.paragraph),
      Field("subParagraph", IntType, resolve = _.value.subParagraph),
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
  paragraph: String,
  subParagraph: Int,
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
