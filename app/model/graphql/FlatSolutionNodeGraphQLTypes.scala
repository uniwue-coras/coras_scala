package model.graphql

import model._
import model.levenshtein.Levenshtein
import sangria.macros.derive.deriveInputObjectType
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.ExecutionContext

object FlatSolutionNodeGraphQLTypes extends GraphQLBasics {

  @unused private implicit val ec: ExecutionContext = ExecutionContext.global

  // Arguments

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  @scala.annotation.unused
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

  private val resolveAnnotationTextRecommendations: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, text, _, _) = context.value

    val markedText = text.substring(context.arg(startIndexArgument), context.arg(endIndexArgument))

    for {
      annotationRecommendations <- context.ctx.tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

      texts = annotationRecommendations
        .sortBy { case (annotation, nodeText) => Levenshtein.distance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
        .map { case (annotation, _) => annotation.text }
    } yield texts
  }

  val flatUserSolutionQueryType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType[GraphQLContext, FlatUserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, FlatUserSolutionNode](flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("annotations", ListType(AnnotationGraphQLTypes.queryType), resolve = resolveAnnotations),
      Field(
        "annotationTextRecommendations",
        ListType(StringType),
        arguments = startIndexArgument :: endIndexArgument :: Nil,
        resolve = resolveAnnotationTextRecommendations
      )
    )
  )

}
