package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.paragraphMatching.{ParagraphCitationLocation, ParagraphExtractor}
import sangria.schema._

trait SolutionNode:
  def id: Int
  def childIndex: Int
  def text: String
  def applicability: Applicability
  def parentId: Option[Int]

  lazy val paragraphCitationLocations = ParagraphExtractor.extractFrom(text)

object SolutionNodeGraphQLTypes extends GraphQLBasics:
  val flatSolutionNodeGraphQLInterfaceType: InterfaceType[GraphQLContext, SolutionNode] = InterfaceType(
    "SolutionNode",
    fields[GraphQLContext, SolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLType, resolve = _.value.applicability),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId),
      Field("paragraphCitationLocations", ListType(ParagraphCitationLocation.queryType), resolve = _.value.paragraphCitationLocations)
    )
  )
