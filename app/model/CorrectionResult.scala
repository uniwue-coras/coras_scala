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

  def forDb(exerciseId: Int, username: String) =
    DbAnnotation(username, exerciseId, nodeId, id, errorType, importance, startIndex, endIndex, text, AnnotationType.Automatic)

final case class CorrectionResult(
  matches: Seq[GeneratedSolutionNodeMatch],
  annotations: Seq[GeneratedAnnotation],
  paragraphCitationAnnotations: Seq[GeneratedParagraphCitationAnnotation]
)

object CorrectionResult:
  val queryType = ObjectType[GraphQLContext, CorrectionResult](
    "CorrectionResult",
    fields[GraphQLContext, CorrectionResult](
      Field("matches", ListType(SolutionNodeMatch.queryType), resolve = _.value.matches),
      Field("annotations", ListType(Annotation.queryType), resolve = _.value.annotations),
      Field("paragraphCitationAnnotations", ListType(ParagraphCitationAnnotation.queryType), resolve = _.value.paragraphCitationAnnotations)
    )
  )
