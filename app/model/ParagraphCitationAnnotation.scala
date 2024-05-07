package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

trait ParagraphCitationAnnotation {
  def sampleNodeId: Int
  def userNodeId: Int
  def awaitedParagraph: String
  def correctness: Correctness
  def citedParagraph: Option[String]
  def explanation: Option[String]
}

object ParagraphCitationAnnotation extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, ParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("awaitedParagraph", StringType, resolve = _.value.awaitedParagraph),
      Field("correctness", Correctness.graphQLType, resolve = _.value.correctness),
      Field("citedParagraph", OptionType(StringType), resolve = _.value.citedParagraph),
      Field("explanation", OptionType(StringType), resolve = _.value.explanation)
    )
  )

  private val resolveUpdate: Resolver[DbParagraphCitationAnnotation, DbParagraphCitationAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno, args) =>
      implicit val ec = _ec
      val newValues   = args.arg(paragraphCitationAnnotationInputArgument)

      for {
        _ <- tableDefs.futureUpdateParagraphCitationAnnotation(parCitAnno.dbKey, newValues)
      } yield parCitAnno.updatedWith(newValues)
  }

  private val resolveDelete: Resolver[DbParagraphCitationAnnotation, DbParagraphCitationAnnotation] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno) =>
      implicit val ec = _ec

      for {
        _ <- tableDefs.futureDeletePararaphCitationAnnotation(parCitAnno.dbKey)
      } yield parCitAnno
  }

  val mutationType: ObjectType[GraphQLContext, DbParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotationMutation",
    fields[GraphQLContext, DbParagraphCitationAnnotation](
      Field("update", queryType, arguments = paragraphCitationAnnotationInputArgument :: Nil, resolve = resolveUpdate),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}

final case class GeneratedParagraphCitationAnnotation(
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  correctness: Correctness,
  citedParagraph: Option[String],
  explanation: Option[String] = None
) extends ParagraphCitationAnnotation {
  def forDb(exerciseId: Int, username: String): DbParagraphCitationAnnotation =
    DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, correctness, citedParagraph, explanation)
}

final case class DbParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  correctness: Correctness,
  citedParagraph: Option[String],
  explanation: Option[String],
  deleted: Boolean = false
) extends ParagraphCitationAnnotation {

  def dbKey: ParagraphCitationAnnotationKey = ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)

  def updatedWith(newValues: ParagraphCitationAnnotationInput) = this.copy(
    awaitedParagraph = newValues.awaitedParagraph,
    correctness = newValues.correctness,
    citedParagraph = newValues.citedParagraph,
    explanation = newValues.explanation
  )

}
