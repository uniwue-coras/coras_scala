package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ObjectType, fields, IntType, OptionType, FloatType, ListType}
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

  override def getParagraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]] =
    tableDefs.futureSelectParagraphCitationAnnotationsForMatch(exerciseId, username, sampleNodeId, userNodeId)

  override def getExplanationAnnotation(tableDefs: TableDefs): Future[Option[ExplanationAnnotation]] =
    tableDefs.futureSelectExplanationAnnotationForMatch(exerciseId, username, sampleNodeId, userNodeId)

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

    val DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _) = solNodeMatch

    for {
      _ <- tableDefs.futureDeleteMatch(username, exerciseId, sampleNodeId, userNodeId)
    } yield solNodeMatch
  }

  private val resolveUpdateParCitCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateParCitCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness
  }

  private val resolveUpdateExplanationCorrectness: Resolver[DbSolutionNodeMatch, Correctness] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, _, _, _, _), args) =>
      implicit val ec    = _ec
      val newCorrectness = args.arg(newCorrectnessArg)

      for {
        _ <- tableDefs.futureUpdateExplanationCorrectness(username, exerciseId, sampleNodeId, userNodeId, newCorrectness)
      } yield newCorrectness
  }

  val mutationType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatchMutations",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("delete", SolutionNodeMatch.queryType, resolve = resolveDelete),
      Field("updateParagraphCitationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateParCitCorrectness),
      Field("updateExplanationCorrectness", Correctness.graphQLType, arguments = newCorrectnessArg :: Nil, resolve = resolveUpdateExplanationCorrectness)
    )
  )

}
