package model.matching.paragraphMatching

import model.graphql.GraphQLContext
import sangria.schema._

final case class ParagraphCitation(
  paragraphType: String,
  lawCode: String,
  paragraphNumber: Int,
  section: Option[Int] = None,
  rest: String = ""
) {
  def stringify(): String = s"$paragraphType $paragraphNumber $section $rest $lawCode"
}

object ParagraphCitation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = ObjectType(
    "ParagraphCitation",
    fields[GraphQLContext, ParagraphCitation](
      Field("paragraphType", StringType, resolve = _.value.paragraphType),
      Field("paragraphNumber", IntType, resolve = _.value.paragraphNumber),
      Field("section", OptionType(IntType), resolve = _.value.section),
      Field("rest", StringType, resolve = _.value.rest),
      Field("lawCode", StringType, resolve = _.value.lawCode)
    )
  )
