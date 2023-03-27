package model.graphql

import model._
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.{BooleanType, EnumType, Field, InputObjectType, IntType, InterfaceType, ListType, ObjectType, OptionType, StringType, fields, interfaces}

object FlatSolutionNodeGraphQLTypes extends GraphQLBasics {

  // noinspection ScalaUnusedSymbol
  private implicit val applicabilityGraphQLType: EnumType[Applicability] = Applicability.graphQLEnumType

  // Input type
  val flatSolutionNodeInputType: InputObjectType[FlatSolutionNodeInput] = deriveInputObjectType()

  // Interface
  private val flatSolutionNodeGraphQLInterfaceType: InterfaceType[GraphQLContext, IFlatSolutionNode] = InterfaceType(
    "IFlatSolutionNode",
    fields[GraphQLContext, IFlatSolutionNode](
      Field("id", IntType, resolve = _.value.id),
      Field("childIndex", IntType, resolve = _.value.childIndex),
      Field("isSubText", BooleanType, resolve = _.value.isSubText),
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLEnumType, resolve = _.value.applicability),
      Field("parentId", OptionType(IntType), resolve = _.value.parentId)
    )
  )

  val flatSampleSolutionGraphQLType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatSampleSolutionNode]()
  )

  private val resolveAnnotations: Resolver[FlatUserSolutionNode, Seq[Annotation]] = context =>
    context.ctx.tableDefs.futureAnnotationsForUserSolutionNode(context.value.username, context.value.exerciseId, context.value.id)

  val flatUserSolutionQueryType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType[GraphQLContext, FlatUserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, FlatUserSolutionNode](flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("annotations", ListType(AnnotationGraphQLTypes.annotationQueryType), resolve = resolveAnnotations)
    )
  )

}
