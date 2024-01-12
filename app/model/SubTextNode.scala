package model

import model.graphql.{GraphQLContext, Resolver}
import sangria.schema._
import model.exporting.ExportedSampleSubTextNode
import scala.concurrent.Future
import model.exporting.ExportedUserSubTextNode
import scala.concurrent.ExecutionContext

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
) extends SubTextNode:
  def exportData: ExportedSampleSubTextNode = ExportedSampleSubTextNode(id, text, applicability)

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
) extends SubTextNode:
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSubTextNode] = for {
    annotations <- tableDefs.futureAnnotationsForSubTextNode(username, exerciseId, nodeId, id)
  } yield ExportedUserSubTextNode(id, text, applicability, annotations.map { _._2 })

object UserSubTextNode:

  // TODO: implement
  private val resolveAnnotations: Resolver[UserSubTextNode, Seq[(UserSubTextNodeAnnotationKey, Annotation)]] = context =>
    context.ctx.tableDefs.futureAnnotationsForSubTextNode(
      context.value.username,
      context.value.exerciseId,
      context.value.nodeId,
      context.value.id
    )

  val queryType: ObjectType[GraphQLContext, UserSubTextNode] = ObjectType(
    "UserSubTextNode",
    interfaces[GraphQLContext, UserSubTextNode](SubTextNode.interfaceType),
    fields[GraphQLContext, UserSubTextNode](
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations)
    )
  )
