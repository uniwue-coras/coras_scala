package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.paragraphMatching.{ParagraphCitationLocation, ParagraphExtractor}
import sangria.schema._

trait IFlatSolutionNode extends SolutionNode:
  val exerciseId: Int

object IFlatSolutionNodeGraphQLTypes extends GraphQLBasics:
  private def resolveCitedParagraphs: Resolver[IFlatSolutionNode, Seq[ParagraphCitationLocation]] = context =>
    ParagraphExtractor.extractFrom(context.value.text)

  val flatSolutionNodeGraphQLInterfaceType: InterfaceType[GraphQLContext, IFlatSolutionNode] = InterfaceType(
    "IFlatSolutionNode",
    fields[GraphQLContext, IFlatSolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("isSubText", BooleanType, resolve = _.value.isSubText),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLType, resolve = _.value.applicability),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId),
      Field("paragraphCitationLocations", ListType(ParagraphCitationLocation.queryType), resolve = resolveCitedParagraphs)
    )
  )
