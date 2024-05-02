package model

import model.graphql.{GraphQLContext, GraphQLBasics}
import sangria.schema._

trait ParagraphCitationAnnotation {
  def sampleNodeId: Int
  def userNodeId: Int
  def awaitedParagraph: String
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
      Field("citedParagraph", OptionType(StringType), resolve = _.value.citedParagraph),
      Field("explanation", OptionType(StringType), resolve = _.value.explanation)
    )
  )

  private val resolveUpdateExplanation: Resolver[DbParagraphCitationAnnotation, String] = unpackedResolverWithArgs {
    case (
          GraphQLContext(_, tableDefs, _, _ec),
          DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, _, _, _),
          args
        ) =>
      implicit val ec = _ec
      val explanation = args.arg(explanationArgument)

      for {
        _ <- tableDefs.futureUpdateParagraphCitationAnnotationExplanation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, Some(explanation))
      } yield explanation
  }

  private val resolveDelete: Resolver[DbParagraphCitationAnnotation, DbParagraphCitationAnnotation] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _ec), parCitAnno) =>
      implicit val ec = _ec

      val DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, _, _, _) = parCitAnno

      for {
        _ <- tableDefs.futureDeletePararaphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)
      } yield parCitAnno
  }

  val mutationType: ObjectType[GraphQLContext, DbParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotationMutation",
    fields[GraphQLContext, DbParagraphCitationAnnotation](
      Field("updateExplanation", StringType, arguments = explanationArgument :: Nil, resolve = resolveUpdateExplanation),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}

final case class GeneratedParagraphCitationAnnotation(
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  citedParagraph: Option[String],
  explanation: Option[String] = None
) extends ParagraphCitationAnnotation {
  def forDb(exerciseId: Int, username: String): DbParagraphCitationAnnotation =
    DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, citedParagraph, explanation)
}

final case class DbParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String,
  citedParagraph: Option[String],
  explanation: Option[String],
  deleted: Boolean = false
) extends ParagraphCitationAnnotation