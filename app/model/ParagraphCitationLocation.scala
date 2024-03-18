package model

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.schema._

final case class ParagraphCitationLocation(
  from: Int,
  to: Int,
  citedParagraphs: Seq[ParagraphCitation]
)

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
      Field("citedParagraphs", ListType(ParagraphCitation.queryType), resolve = _.value.citedParagraphs)
    )
  )
