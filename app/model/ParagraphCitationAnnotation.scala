package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

final case class ParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  correctness: Correctness,
  citedParagraph: Option[String] = None,
  explanation: Option[String] = None,
  deleted: Boolean = false
) {

  def dbKey: ParagraphCitationAnnotationKey = ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)

  def updatedWith(newValues: ParagraphCitationAnnotationInput) = this.copy(
    awaitedParagraph = newValues.awaitedParagraph,
    correctness = newValues.correctness,
    citedParagraph = newValues.citedParagraph,
    explanation = newValues.explanation
  )
}

object ParagraphCitationAnnotation extends GraphQLBasics {

  private val resolveExplanationRecommendations: Resolver[ParagraphCitationAnnotation, Seq[String]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno) => tableDefs.futureSelectParagraphCitationAnnotationExplanationRecommendations(parCitAnno.dbKey)
  }

  val queryType: ObjectType[GraphQLContext, ParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("awaitedParagraph", StringType, resolve = _.value.awaitedParagraph),
      Field("correctness", Correctness.graphQLType, resolve = _.value.correctness),
      Field("citedParagraph", OptionType(StringType), resolve = _.value.citedParagraph),
      Field("explanation", OptionType(StringType), resolve = _.value.explanation),
      Field("explanationRecommendations", ListType(StringType), resolve = resolveExplanationRecommendations)
    )
  )

  private val resolveUpdate: Resolver[ParagraphCitationAnnotation, ParagraphCitationAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno, args) =>
      implicit val ec = _ec
      val newValues   = args.arg(paragraphCitationAnnotationInputArgument)

      for {
        _ <- tableDefs.futureUpdateParagraphCitationAnnotation(parCitAnno.dbKey, newValues)
      } yield parCitAnno.updatedWith(newValues)
  }

  private val resolveDelete: Resolver[ParagraphCitationAnnotation, ParagraphCitationAnnotation] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno) =>
      implicit val ec = _ec

      for {
        _ <- tableDefs.futureDeletePararaphCitationAnnotation(parCitAnno.dbKey)
      } yield parCitAnno
  }

  val mutationType: ObjectType[GraphQLContext, ParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotationMutation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("update", queryType, arguments = paragraphCitationAnnotationInputArgument :: Nil, resolve = resolveUpdate),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}
