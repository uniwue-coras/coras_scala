package model

import model.graphql.GraphQLBasics
import model.graphql.GraphQLContext
import sangria.schema.{ObjectType, fields, Field, IntType, StringType}

trait ExplanationAnnotation {
  def sampleNodeId: Int
  def userNodeId: Int
  def annotation: String
}

object ExplanationAnnotation extends GraphQLBasics {
  val queryType = ObjectType[GraphQLContext, ExplanationAnnotation](
    "ExplanationAnnotation",
    fields[GraphQLContext, ExplanationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("annotation", StringType, resolve = _.value.annotation)
    )
  )
}

final case class GeneratedExplanationAnnotation(
  sampleNodeId: Int,
  userNodeId: Int,
  annotation: String
) extends ExplanationAnnotation {

  def forDb(exerciseId: Int, username: String) = DbExplanationAnnotation(exerciseId, username, sampleNodeId, userNodeId, annotation)

}

final case class DbExplanationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  annotation: String
) extends ExplanationAnnotation
