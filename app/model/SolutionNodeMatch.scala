package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.Future

trait SolutionNodeMatch {
  def exerciseId: Int
  def username: String
  def sampleNodeId: Int
  def userNodeId: Int
  def paragraphCitationCorrectness: Correctness
  def explanationCorrectness: Correctness
  def certainty: Option[Double]
  def matchStatus: MatchStatus

  def dbKey = SolutionNodeMatchKey(exerciseId, username, sampleNodeId, userNodeId)

  def getParagraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]]
  def getParagraphCitationAnnotation(tableDefs: TableDefs, awaitedParagraph: String): Future[Option[ParagraphCitationAnnotation]]
  def getExplanationAnnotation(tableDefs: TableDefs): Future[Option[ExplanationAnnotation]]
}

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double] = None,
  matchStatus: MatchStatus = MatchStatus.Automatic
) extends SolutionNodeMatch {

  override def getParagraphCitationAnnotation(tableDefs: TableDefs, awaitedParagraph: String): Future[Option[ParagraphCitationAnnotation]] =
    tableDefs.futureSelectParagraphCitationAnnotation(ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph))

  override def getParagraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]] =
    tableDefs.futureSelectParagraphCitationAnnotationsForMatch(exerciseId, username, sampleNodeId, userNodeId)

  override def getExplanationAnnotation(tableDefs: TableDefs): Future[Option[ExplanationAnnotation]] =
    tableDefs.futureSelectExplanationAnnotationForMatch(dbKey)
}

object SolutionNodeMatch extends GraphQLBasics {

  val resolveParagraphCitationAnnotationQuery: Resolver[SolutionNodeMatch, Option[ParagraphCitationAnnotation]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, solutionNodeMatch, args) => solutionNodeMatch.getParagraphCitationAnnotation(tableDefs, args.arg(awaitedParagraphArgument))
  }

  val resolveParagraphCitationAnnotationQueries: Resolver[SolutionNodeMatch, Seq[ParagraphCitationAnnotation]] = unpackedResolver {
    case (_, tableDefs, _, solutionNodeMatch) => solutionNodeMatch.getParagraphCitationAnnotations(tableDefs)
  }

  val resolveExplanationAnnotations: Resolver[SolutionNodeMatch, Option[ExplanationAnnotation]] = unpackedResolver {
    case (_, tableDefs, _, solutionNodeMatch) => solutionNodeMatch.getExplanationAnnotation(tableDefs)
  }

  val resolveExplanationAnnotationRecommendations: Resolver[SolutionNodeMatch, Seq[String]] = unpackedResolver { case (_, tableDefs, _, solutionNodeMatch) =>
    tableDefs.futureSelectExplanationAnnotationRecommendations(solutionNodeMatch.dbKey)
  }

  val queryType: ObjectType[GraphQLContext, SolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      // paragraph citations
      Field("paragraphCitationCorrectness", Correctness.graphQLType, resolve = _.value.paragraphCitationCorrectness),
      Field(
        "paragraphCitationAnnotation",
        OptionType(ParagraphCitationAnnotation.queryType),
        arguments = awaitedParagraphArgument :: Nil,
        resolve = resolveParagraphCitationAnnotationQuery
      ),
      Field("paragraphCitationAnnotations", ListType(ParagraphCitationAnnotation.queryType), resolve = resolveParagraphCitationAnnotationQueries),
      // explanations
      Field("explanationCorrectness", Correctness.graphQLType, resolve = _.value.explanationCorrectness),
      Field("explanationAnnotation", OptionType(ExplanationAnnotation.queryType), resolve = resolveExplanationAnnotations),
      Field("explanationAnnotationRecommendations", ListType(StringType), resolve = resolveExplanationAnnotationRecommendations)
    )
  )

  private val resolveDelete: Resolver[DbSolutionNodeMatch, DbSolutionNodeMatch] = unpackedResolver { case (_, tableDefs, _ec, solNodeMatch) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteMatch(solNodeMatch.dbKey)
    } yield solNodeMatch
  }

  private val resolveUpdateParCitCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, dbSolutionNodeMatch, args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateParCitCorrectness(dbSolutionNodeMatch.dbKey, newCorrectness)
      } yield newCorrectness
  }

  private val resolveSubmitParagraphCitationAnnotation: Resolver[DbSolutionNodeMatch, ParagraphCitationAnnotation] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec                                                                                  = _ec
      val ParagraphCitationAnnotationInput(awaitedParagraph, correctness, citedParagraph, explanation) = args.arg(paragraphCitationAnnotationInputArgument)

      val newParCitAnno =
        ParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, correctness, citedParagraph, explanation)

      for {
        _ <- tableDefs.futureInsertParagraphCitationAnnotation(newParCitAnno)
      } yield newParCitAnno
  }

  val resolveParagraphCitationAnnotationMutation: Resolver[DbSolutionNodeMatch, Option[ParagraphCitationAnnotation]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      tableDefs.futureSelectParagraphCitationAnnotation(
        ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, args.arg(awaitedParagraphArgument))
      )
  }

  private val resolveUpdateExplanationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, dbSolutionNodeMatch, args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateExplanationCorrectness(dbSolutionNodeMatch.dbKey, newCorrectness)
      } yield newCorrectness
  }

  private val resolveSubmitExplanationAnnotation: Resolver[DbSolutionNodeMatch, ExplanationAnnotation] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec = _ec
      val dbExplAnno  = ExplanationAnnotation(exerciseId, username, sampleNodeId, userNodeId, args.arg(textArgument))

      for {
        _ <- tableDefs.futureInsertExplanationAnnotation(dbExplAnno)
      } yield dbExplAnno
  }

  val resolveExplanationAnnotationMutations: Resolver[DbSolutionNodeMatch, Option[ExplanationAnnotation]] = unpackedResolver {
    case (_, tableDefs, _, dbSolutionNodeMatch) => tableDefs.futureSelectExplanationAnnotationForMatch(dbSolutionNodeMatch.dbKey)
  }

  val mutationType = ObjectType[GraphQLContext, DbSolutionNodeMatch](
    "SolutionNodeMatchMutations",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("delete", SolutionNodeMatch.queryType, resolve = resolveDelete),
      // paragraph citation
      Field("updateParagraphCitationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateParCitCorrectness),
      Field(
        "submitParagraphCitationAnnotation",
        ParagraphCitationAnnotation.queryType,
        arguments = paragraphCitationAnnotationInputArgument :: Nil,
        resolve = resolveSubmitParagraphCitationAnnotation
      ),
      Field(
        "paragraphCitationAnnotation",
        OptionType(ParagraphCitationAnnotation.mutationType),
        arguments = awaitedParagraphArgument :: Nil,
        resolve = resolveParagraphCitationAnnotationMutation
      ),
      // explanations
      Field("updateExplanationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateExplanationCorrectness),
      Field("submitExplanationAnnotation", ExplanationAnnotation.queryType, arguments = textArgument :: Nil, resolve = resolveSubmitExplanationAnnotation),
      Field("explanationAnnotation", OptionType(ExplanationAnnotation.mutationType), resolve = resolveExplanationAnnotationMutations)
    )
  )

}
