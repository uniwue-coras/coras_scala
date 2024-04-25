package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.Future

trait SolutionNodeMatch:
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]
  @deprecated
  def paragraphCitationCorrectness: Correctness
  def explanationCorrectness: Correctness

  def paragraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]]

object SolutionNodeMatch extends GraphQLBasics:

  private val resolveParagraphCitationAnnotations: Resolver[SolutionNodeMatch, Seq[ParagraphCitationAnnotation]] = context => {
    context.value.paragraphCitationAnnotations(context.ctx.tableDefs)
  }

  def interfaceType: InterfaceType[GraphQLContext, SolutionNodeMatch] = InterfaceType(
    "ISolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("paragraphCitationCorrectness", Correctness.graphQLType, resolve = _.value.paragraphCitationCorrectness),
      Field("explanationCorrectness", Correctness.graphQLType, resolve = _.value.explanationCorrectness),
      Field("paragraphCitationResult", ListType(ParagraphCitationAnnotation.interfaceType), resolve = resolveParagraphCitationAnnotations)
    )
  )
