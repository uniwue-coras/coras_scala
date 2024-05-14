package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.Future

trait SolutionNodeMatch {
  def sampleNodeId: Int
  def userNodeId: Int
  def paragraphCitationCorrectness: Correctness
  def explanationCorrectness: Correctness
  def certainty: Option[Double]
  def matchStatus: MatchStatus

  def getParagraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]]
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
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch] {

  def dbKey = SolutionNodeMatchKey(exerciseId, username, sampleNodeId, userNodeId)

  override def getParagraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]] =
    tableDefs.futureSelectParagraphCitationAnnotationsForMatch(exerciseId, username, sampleNodeId, userNodeId)

  override def getExplanationAnnotation(tableDefs: TableDefs): Future[Option[ExplanationAnnotation]] =
    tableDefs.futureSelectExplanationAnnotationForMatch(dbKey)

  override def exportData: ExportedSolutionNodeMatch =
    ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, paragraphCitationCorrectness, explanationCorrectness, certainty)

}

object SolutionNodeMatch extends GraphQLBasics {

  val resolveParagraphCitationAnnotations: Resolver[SolutionNodeMatch, Seq[ParagraphCitationAnnotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), solutionNodeMatch) => solutionNodeMatch.getParagraphCitationAnnotations(tableDefs)
  }

  val resolveExplanationAnnotations: Resolver[SolutionNodeMatch, Option[ExplanationAnnotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), solutionNodeMatch) => solutionNodeMatch.getExplanationAnnotation(tableDefs)
  }

  val queryType: ObjectType[GraphQLContext, SolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("paragraphCitationCorrectness", Correctness.graphQLType, resolve = _.value.paragraphCitationCorrectness),
      Field("explanationCorrectness", Correctness.graphQLType, resolve = _.value.explanationCorrectness),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("paragraphCitationAnnotations", ListType(ParagraphCitationAnnotation.queryType), resolve = resolveParagraphCitationAnnotations),
      Field("explanationAnnotation", OptionType(ExplanationAnnotation.queryType), resolve = resolveExplanationAnnotations)
    )
  )

  private val resolveDelete: Resolver[DbSolutionNodeMatch, SolutionNodeMatch] = unpackedResolver { case (GraphQLContext(_, tableDefs, _, _ec), solNodeMatch) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteMatch(solNodeMatch.dbKey)
    } yield solNodeMatch
  }

  private val resolveUpdateParCitCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), dbSolutionNodeMatch, args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateParCitCorrectness(dbSolutionNodeMatch.dbKey, newCorrectness)
      } yield newCorrectness
  }

  private val resolveSubmitParagraphCitationAnnotation: Resolver[DbSolutionNodeMatch, DbParagraphCitationAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec                                                                                  = _ec
      val ParagraphCitationAnnotationInput(awaitedParagraph, correctness, citedParagraph, explanation) = args.arg(paragraphCitationAnnotationInputArgument)

      val newParCitAnno =
        DbParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, correctness, citedParagraph, explanation)

      for {
        _ <- tableDefs.futureInsertParagraphCitationAnnotation(newParCitAnno)
      } yield newParCitAnno
  }

  private val resolveParagraphCitationAnnotation: Resolver[DbSolutionNodeMatch, Option[DbParagraphCitationAnnotation]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      val awaitedParagraph = args.arg(awaitedParagraphArgument)

      tableDefs.futureSelectParagraphCitationAnnotation(
        ParagraphCitationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)
      )
  }

  private val resolveUpdateExplanationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), dbSolutionNodeMatch, args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateExplanationCorrectness(dbSolutionNodeMatch.dbKey, newCorrectness)
      } yield newCorrectness
  }

  private val resolveSubmitExplanationAnnotation: Resolver[DbSolutionNodeMatch, DbExplanationAnnotation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec = _ec
      val dbExplAnno  = DbExplanationAnnotation(exerciseId, username, sampleNodeId, userNodeId, args.arg(textArgument))

      for {
        _ <- tableDefs.futureInsertExplanationAnnotation(dbExplAnno)
      } yield dbExplAnno
  }

  val resolveExplanationAnnotationMutations: Resolver[DbSolutionNodeMatch, Option[DbExplanationAnnotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), dbSolutionNodeMatch) => tableDefs.futureSelectExplanationAnnotationForMatch(dbSolutionNodeMatch.dbKey)
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
        resolve = resolveParagraphCitationAnnotation
      ),
      Field(
        "paragraphCitationAnnotations",
        OptionType(ParagraphCitationAnnotation.queryType),
        arguments = awaitedParagraphArgument :: Nil,
        resolve = resolveParagraphCitationAnnotation
      ),
      // explanations
      Field("updateExplanationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateExplanationCorrectness),
      Field("submitExplanationAnnotation", ExplanationAnnotation.queryType, arguments = textArgument :: Nil, resolve = resolveSubmitExplanationAnnotation),
      Field("explanationAnnotation", OptionType(ExplanationAnnotation.mutationType), resolve = resolveExplanationAnnotationMutations)
    )
  )

}
