package model

import model.graphql.GraphQLContext
import sangria.schema._
import model.graphql.Resolver

trait SubTextNode:
  def exerciseId: Int
  def nodeId: Int
  def id: Int
  def text: String
  def applicability: Applicability

object SubTextNode:
  val interfaceType: InterfaceType[GraphQLContext, SubTextNode] = InterfaceType(
    "SubTextNode",
    fields[GraphQLContext, SubTextNode](
      Field("text", StringType, resolve = _.value.text),
      Field("applicability", Applicability.graphQLType, resolve = _.value.applicability)
    )
  )

final case class SampleSubTextNode(
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability
) extends SubTextNode

object SampleSubTextNode:
  val queryType: ObjectType[GraphQLContext, SampleSubTextNode] = ObjectType(
    "SampleSubTextNode",
    interfaces[GraphQLContext, SampleSubTextNode](SubTextNode.interfaceType),
    fields[GraphQLContext, SampleSubTextNode]()
  )

final case class UserSubTextNode(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability
) extends SubTextNode

object UserSubTextNode:

  // TODO: implement
  private val resolveAnnotations: Resolver[UserSubTextNode, Seq[Annotation]] = context => Seq.empty

  val queryType: ObjectType[GraphQLContext, UserSubTextNode] = ObjectType(
    "UserSubTextNode",
    interfaces[GraphQLContext, UserSubTextNode](SubTextNode.interfaceType),
    fields[GraphQLContext, UserSubTextNode](
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations)
    )
  )
