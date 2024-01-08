package model

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.{ParagraphCitationLocation, ParagraphExtractor}
import sangria.schema._

import scala.concurrent.Future

trait SolutionNode:
  def id: Int
  def childIndex: Int
  def text: String
  def applicability: Applicability
  def parentId: Option[Int]

  lazy val paragraphCitationLocations = ParagraphExtractor.extractFrom(text)

  def resolveSubTextNodes(context: GraphQLContext): Future[Seq[SubTextNode]]

  def resolveSubTexts(context: GraphQLContext): Future[Seq[String]] = {
    implicit val ec = context.ec
    for {
      nodes <- resolveSubTextNodes(context)
    } yield nodes.map(_.text)
  }

object SolutionNode:
  val interfaceType: InterfaceType[GraphQLContext, SolutionNode] = InterfaceType(
    "SolutionNode",
    fields[GraphQLContext, SolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLType, resolve = _.value.applicability),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId),
      Field("paragraphCitationLocations", ListType(ParagraphCitationLocation.queryType), resolve = _.value.paragraphCitationLocations),
      Field("subTexts", ListType(StringType), resolve = context => context.value.resolveSubTexts(context.ctx))
    )
  )
