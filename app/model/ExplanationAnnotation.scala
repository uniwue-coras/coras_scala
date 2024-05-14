package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

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

  private val resolveEdit: Resolver[DbExplanationAnnotation, String] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _ec), explanationAnnotation, args) =>
      implicit val ec = _ec
      val newText     = args.arg(newTextArgument)

      for {
        _ <- tableDefs.futureUpdateExplanationAnnotation(explanationAnnotation.dbKey, newText)
      } yield newText
  }

  private val resolveDelete: Resolver[DbExplanationAnnotation, ExplanationAnnotation] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _ec), explanationAnnotation) =>
      implicit val ec = _ec

      for {
        _ <- tableDefs.futureDeleteExplanationAnnotation(explanationAnnotation.dbKey)
      } yield explanationAnnotation
  }

  val mutationType: ObjectType[GraphQLContext, DbExplanationAnnotation] = ObjectType[GraphQLContext, DbExplanationAnnotation](
    "ExplanationAnnotationMutations",
    fields[GraphQLContext, DbExplanationAnnotation](
      Field("edit", StringType, arguments = newTextArgument :: Nil, resolve = resolveEdit),
      Field("delete", queryType, resolve = resolveDelete)
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
) extends ExplanationAnnotation {
  def dbKey = SolutionNodeMatchKey(exerciseId, username, sampleNodeId, userNodeId)
}
