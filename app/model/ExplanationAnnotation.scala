package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

final case class ExplanationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  text: String
) {
  def dbKey = ExplanationAnnotationKey(exerciseId, username, sampleNodeId, userNodeId, text)
}

object ExplanationAnnotation extends GraphQLBasics {
  val queryType = ObjectType[GraphQLContext, ExplanationAnnotation](
    "ExplanationAnnotation",
    fields[GraphQLContext, ExplanationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("text", StringType, resolve = _.value.text)
    )
  )

  private val resolveEdit: Resolver[ExplanationAnnotation, String] = unpackedResolverWithArgs { case (_, tableDefs, _ec, explanationAnnotation, args) =>
    implicit val ec = _ec
    val newText     = args.arg(textArgument)

    for {
      _ <- tableDefs.futureUpdateExplanationAnnotation(explanationAnnotation.dbKey, newText)
    } yield newText
  }

  private val resolveDelete: Resolver[ExplanationAnnotation, ExplanationAnnotation] = unpackedResolver { case (_, tableDefs, _ec, explanationAnnotation) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteExplanationAnnotation(explanationAnnotation.dbKey)
    } yield explanationAnnotation
  }

  val mutationType = ObjectType[GraphQLContext, ExplanationAnnotation](
    "ExplanationAnnotationMutations",
    fields[GraphQLContext, ExplanationAnnotation](
      Field("edit", StringType, arguments = textArgument :: Nil, resolve = resolveEdit),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}
