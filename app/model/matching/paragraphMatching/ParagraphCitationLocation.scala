package model.matching.paragraphMatching

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.schema._

final case class ParagraphCitation(
  paragraphType: String,
  lawCode: String,
  paragraphNumber: Int,
  section: Option[Int] = None,
  rest: String = ""
)

final case class ParagraphCitationLocation(
  from: Int,
  to: Int,
  citedParagraphs: Seq[ParagraphCitation]
)

type CitedParag = (Int, String)

object ParagraphCitationLocation:

  val paragraphCitationFormat: OFormat[ParagraphCitation] = Json.format

  val jsonFormat: OFormat[ParagraphCitationLocation] = {
    implicit val x0: OFormat[ParagraphCitation] = paragraphCitationFormat

    Json.format
  }

  val queryType: ObjectType[GraphQLContext, ParagraphCitationLocation] = ObjectType(
    "ParagraphCitationLocation",
    fields[GraphQLContext, ParagraphCitationLocation](
      Field("from", IntType, resolve = _.value.from),
      Field("to", IntType, resolve = _.value.to),
      Field("citedParagraph", ListType(StringType), resolve = _ => Seq.empty)
    )
  )
