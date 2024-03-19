package model

import model.graphql.GraphQLContext
import sangria.schema._

final case class ParagraphCitation(paragraphType: String, lawCode: String, paragraph: String, subParagraph: Option[Int] = None, rest: String = ""):
  def identifier: ParagraphSynonymIdentifier = ParagraphSynonymIdentifier(paragraphType, paragraph, subParagraph.getOrElse(0), lawCode)

  def stringify(): String = {
    val sectionPart = subParagraph.map(s => s"S. $s").getOrElse("")
    s"$paragraphType $paragraph $sectionPart $rest $lawCode"
  }

object ParagraphCitation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = ObjectType(
    "ParagraphCitation",
    fields[GraphQLContext, ParagraphCitation](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("paragraph", StringType, resolve = _.value.paragraph),
      Field("subParagraph", OptionType(IntType), resolve = _.value.subParagraph),
      Field("rest", StringType, resolve = _.value.rest),
      Field("lawCode", StringType, resolve = _.value.lawCode),
      Field("identifier", ParagraphSynonymIdentifier.queryType, resolve = _.value.identifier)
    )
  )
