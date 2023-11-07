package model

import model.ls6.model.{Applicability, SolutionNode}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.macros.derive.deriveEnumType
import sangria.schema._

trait IFlatSolutionNode extends SolutionNode {
  val exerciseId: Int
}

object IFlatSolutionNodeGraphQLTypes extends GraphQLBasics {

  private val applicabilityGraphQLType: EnumType[Applicability] = deriveEnumType()

  val flatSolutionNodeGraphQLInterfaceType: InterfaceType[GraphQLContext, IFlatSolutionNode] = InterfaceType(
    "IFlatSolutionNode",
    fields[GraphQLContext, IFlatSolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("isSubText", BooleanType, resolve = _.value.isSubText),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", applicabilityGraphQLType, resolve = _.value.applicability),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId)
    )
  )

}
