package model.graphql

import model._
import sangria.macros.derive.{ExcludeFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.ExecutionContext

object AnnotationGraphQLTypes extends QueryType[Annotation] with MutationType[Annotation] with MyInputType[AnnotationInput] {

  @unused private implicit val errorTypeType: EnumType[ErrorType]                       = ErrorType.graphQLType
  @unused private implicit val annotationTypeType: EnumType[AnnotationType]             = AnnotationType.graphQLType
  @unused private implicit val annotationImportanceType: EnumType[AnnotationImportance] = AnnotationImportance.graphQLType

  override val inputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  override val queryType: ObjectType[GraphQLContext, Annotation] = deriveObjectType(
    ExcludeFields("username", "exerciseId", "nodeId")
  )

  private val resolveDeleteAnnotation: Resolver[Annotation, Int] = context => {
    @unused implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value.username, context.value.exerciseId, context.value.nodeId, context.value.id)
    } yield context.value.id
  }

  private val resolveRejectAnnotation: Resolver[Annotation, Boolean] = context => {
    // TODO: reject automated annotation!

    ???
  }

  override val mutationType: ObjectType[GraphQLContext, Annotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, Annotation](
      Field("delete", IntType, resolve = resolveDeleteAnnotation),
      Field("reject", BooleanType, resolve = resolveRejectAnnotation)
    )
  )

}
