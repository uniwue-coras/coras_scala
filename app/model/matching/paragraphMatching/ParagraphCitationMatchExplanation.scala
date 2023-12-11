package model.matching.paragraphMatching

import model.graphql.GraphQLContext
import model.matching.MatchExplanation
import sangria.schema.{BooleanType, Field, ObjectType, fields}

final case class ParagraphCitationMatchExplanation(
  paragraphTypeEqual: Boolean,
  lawCodeEqual: Boolean,
  paragraphNumberEqual: Boolean
) extends MatchExplanation:

  private val parTypeWeight   = 1
  private val lawCodeWeight   = 6
  private val parNumberWeight = 10

  override lazy val certainty: Double = {
    val parTypeCertainty = if paragraphTypeEqual then parTypeWeight else 0

    val lawCodeCertainty = if lawCodeEqual then lawCodeWeight else 0

    val parNumberCertainty = if paragraphNumberEqual then parNumberWeight else 0

    (parTypeCertainty + lawCodeCertainty + parNumberCertainty) / (parTypeWeight + lawCodeWeight + parNumberWeight).toDouble
  }

object ParagraphCitationMatchExplanation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitationMatchExplanation] = ObjectType(
    "ParagraphCitationMatchExplanation",
    fields[GraphQLContext, ParagraphCitationMatchExplanation](
      Field("paragraphTypeEqual", BooleanType, resolve = _.value.paragraphTypeEqual)
    )
  )
