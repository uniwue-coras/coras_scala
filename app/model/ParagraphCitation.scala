package model

import model.graphql.GraphQLContext
import sangria.schema._

final case class ParagraphCitation(
  paragraphType: String,
  lawCode: String,
  paragraph: String,
  subParagraph: Option[String] = None,
  sentence: Option[String] = None,
  number: Option[String] = None,
  alternative: Option[String] = None
):
  def identifier: ParagraphSynonymIdentifier = ParagraphSynonymIdentifier(paragraphType, paragraph, subParagraph.getOrElse("0"), lawCode)

  def stringify(): String = {
    val sectionPart = subParagraph.map(s => s"S. $s").getOrElse("")
    s"$paragraphType $paragraph $sectionPart $lawCode"
  }

object ParagraphCitation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = ObjectType(
    "ParagraphCitation",
    fields[GraphQLContext, ParagraphCitation](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("lawCode", StringType, resolve = _.value.lawCode),
      Field("paragraph", StringType, resolve = _.value.paragraph),
      Field("subParagraph", OptionType(StringType), resolve = _.value.subParagraph),
      Field("sentence", OptionType(StringType), resolve = _.value.sentence),
      Field("number", OptionType(StringType), resolve = _.value.number),
      Field("alternative", OptionType(StringType), resolve = _.value.alternative),
      Field("identifier", ParagraphSynonymIdentifier.queryType, resolve = _.value.identifier)
    )
  )
