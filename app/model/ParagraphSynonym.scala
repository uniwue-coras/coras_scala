package model

import model.graphql.GraphQLContext
import sangria.schema._

trait IParagraphSynonymIdentifier {
  def paragraphType: String
  def paragraph: String
  def section: String
  def lawCode: String
}

final case class ParagraphSynonymIdentifier(
  paragraphType: String,
  paragraph: String,
  section: String,
  lawCode: String
) extends IParagraphSynonymIdentifier

object ParagraphSynonymIdentifier {
  val interfaceType = InterfaceType[GraphQLContext, IParagraphSynonymIdentifier](
    "IParagraphSynonymIdentifier",
    fields[GraphQLContext, IParagraphSynonymIdentifier](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("paragraph", StringType, resolve = _.value.paragraph),
      Field("section", StringType, resolve = _.value.section),
      Field("lawCode", StringType, resolve = _.value.lawCode)
    )
  )

  val queryType: ObjectType[GraphQLContext, ParagraphSynonymIdentifier] = ObjectType(
    "ParagraphSynonymIdentifier",
    interfaces[GraphQLContext, ParagraphSynonymIdentifier](interfaceType),
    Nil
  )
}

final case class ParagraphSynonym(
  paragraphType: String,
  paragraph: String,
  section: String,
  sentenceNumber: Option[String],
  lawCode: String,
  synonym: String
) extends IParagraphSynonymIdentifier

object ParagraphSynonym {
  def build(paragraphSynonymIdentifier: ParagraphSynonymIdentifier, maybeSentenceNumber: Option[String], synonym: String) = paragraphSynonymIdentifier match {
    case ParagraphSynonymIdentifier(paragraphType, paragraphNumber, section, lawCode) =>
      ParagraphSynonym(paragraphType, paragraphNumber, section, maybeSentenceNumber, lawCode, synonym)
  }

  val queryType: ObjectType[GraphQLContext, ParagraphSynonym] = ObjectType(
    "ParagraphSynonym",
    interfaces[GraphQLContext, ParagraphSynonym](ParagraphSynonymIdentifier.interfaceType),
    fields[GraphQLContext, ParagraphSynonym](
      Field("sentenceNumber", OptionType(StringType), resolve = _.value.sentenceNumber),
      Field("synonym", StringType, resolve = _.value.synonym)
    )
  )
}
