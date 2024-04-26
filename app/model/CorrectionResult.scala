package model

import model.graphql.GraphQLContext
import sangria.schema._

final case class GeneratedAnnotation(
  nodeId: Int,
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  certainty: Option[Double]
) extends Annotation:
  override def annotationType: AnnotationType = AnnotationType.Automatic

object GeneratedAnnotation:
  val queryType = ObjectType[GraphQLContext, GeneratedAnnotation](
    "GeneratedAnnotation",
    interfaces[GraphQLContext, GeneratedAnnotation](Annotation.interfaceType),
    fields[GraphQLContext, GeneratedAnnotation](
      Field("nodeId", IntType, resolve = _.value.nodeId),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )

final case class CorrectionResult(
  matches: Seq[GeneratedSolutionNodeMatch],
  annotations: Seq[GeneratedAnnotation]
)

object CorrectionResult:
  val queryType = ObjectType[GraphQLContext, CorrectionResult](
    "CorrectionResult",
    fields[GraphQLContext, CorrectionResult](
      Field("matches", ListType(SolutionNodeMatch.queryType), resolve = _.value.matches),
      Field("annotations", ListType(GeneratedAnnotation.queryType), resolve = _.value.annotations),
      Field("paragraphCitationAnnotations", ListType(ParagraphCitationAnnotation.interfaceType), resolve = _ => Seq.empty)
    )
  )
