package model

import model.graphql.GraphQLContext
import sangria.schema._

final case class ParagraphCitationLocation(
  from: Int,
  to: Int,
  citedParagraphs: Seq[ParagraphCitation],
  rest: String
)

object ParagraphCitationLocation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitationLocation] = ObjectType(
    "ParagraphCitationLocation",
    fields[GraphQLContext, ParagraphCitationLocation](
      Field("from", IntType, resolve = _.value.from),
      Field("to", IntType, resolve = _.value.to),
      Field("citedParagraphs", ListType(ParagraphCitation.queryType), resolve = _.value.citedParagraphs),
      Field("rest", StringType, resolve = _.value.rest)
    )
  )
