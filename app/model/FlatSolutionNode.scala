package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

trait IFlatSolutionNode {
  val exerciseId: Int
  val id: Int
  val childIndex: Int
  val isSubText: Boolean
  val text: String
  val applicability: Applicability
  val parentId: Option[Int]
}

final case class FlatSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends IFlatSolutionNode

final case class FlatUserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends IFlatSolutionNode

final case class FlatSolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

trait FlatSolutionNodeGraphQLTypes extends GraphQLBasics with AnnotationGraphQLTypes {

  // noinspection ScalaUnusedSymbol
  private implicit val x0: EnumType[Applicability] = Applicability.graphQLEnumType

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

  protected val flatSolutionGraphQLType: ObjectType[GraphQLContext, FlatSolutionNode] = ObjectType[GraphQLContext, FlatSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSolutionNode](flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatSolutionNode]()
  )

  private val resolveAnnotations: Resolver[FlatUserSolutionNode, Seq[Annotation]] = context =>
    context.ctx.tableDefs.futureAnnotationsForUserSolutionNode(context.value.username, context.value.exerciseId, context.value.id)

  protected val flatUserSolutionGraphQLType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType[GraphQLContext, FlatUserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, FlatUserSolutionNode](flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("annotations", ListType(annotationGraphQLType), resolve = resolveAnnotations)
    )
  )

}
