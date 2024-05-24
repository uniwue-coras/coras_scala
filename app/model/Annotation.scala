package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

final case class AnnotationKey(username: String, exerciseId: Int, nodeId: Int, id: Int)

final case class Annotation(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  errorType: ErrorType,
  importance: Importance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
) {
  def dbKey = AnnotationKey(username, exerciseId, nodeId, id)

  def updatedWith(input: AnnotationInput): Annotation = this.copy(
    errorType = input.errorType,
    importance = input.importance,
    startIndex = input.startIndex,
    endIndex = input.endIndex,
    text = input.text
  )
}

object Annotation extends GraphQLBasics {
  val queryType = ObjectType[GraphQLContext, Annotation](
    "Annotation",
    fields[GraphQLContext, Annotation](
      Field("id", IntType, resolve = _.value.id),
      Field("errorType", ErrorType.graphQLType, resolve = _.value.errorType),
      Field("importance", Importance.graphQLType, resolve = _.value.importance),
      Field("startIndex", IntType, resolve = _.value.startIndex),
      Field("endIndex", IntType, resolve = _.value.endIndex),
      Field("text", StringType, resolve = _.value.text),
      Field("annotationType", AnnotationType.graphQLType, resolve = _.value.annotationType)
    )
  )

  private val resolveUpdateAnnotation: Resolver[Annotation, Annotation] = unpackedResolverWithArgs { case (_, tableDefs, _ec, annotation, args) =>
    implicit val ec = _ec

    val annotationInput = args.arg(annotationArgument)

    for {
      _ <- tableDefs.futureUpdateAnnotation(annotation.dbKey, annotationInput)
    } yield annotation updatedWith annotationInput
  }

  private val resolveDeleteAnnotation: Resolver[Annotation, Int] = unpackedResolver { case (_, tableDefs, _ec, annotation) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteAnnotation(annotation.dbKey)
    } yield annotation.id
  }

  val mutationType: ObjectType[GraphQLContext, Annotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, Annotation](
      Field("update", queryType, arguments = annotationArgument :: Nil, resolve = resolveUpdateAnnotation),
      Field("delete", IntType, resolve = resolveDeleteAnnotation)
    )
  )
}
