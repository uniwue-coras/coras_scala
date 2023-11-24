package corasEvaluator

import play.api.libs.json.{Json, OFormat}
import model.matching.nodeMatching.SolutionNodeMatchExplanation

final case class TextsForComparison(
  sample: String,
  user: String,
  certainty: Double,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
)

object TextsForComparison:
  val jsonFormat: OFormat[TextsForComparison] = {
    implicit val SolutionNodeMatchExplanationFormat: OFormat[SolutionNodeMatchExplanation] = Json.format

    Json.format
  }

final case class Numbers(
  truePositiveCount: Int,
  falsePositiveTexts: Seq[TextsForComparison],
  falseNegativeTexts: Seq[TextsForComparison]
) {

  val falsePositiveCount = falsePositiveTexts.length
  val falseNegativeCount = falseNegativeTexts.length

  lazy val precisionPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePositiveCount) / (2 * truePositiveCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePositiveCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: Numbers): Numbers = Numbers(
    this.truePositiveCount + that.truePositiveCount,
    this.falsePositiveTexts ++ that.falsePositiveTexts,
    this.falseNegativeTexts ++ that.falseNegativeTexts
  )

}

object Numbers:
  def zero: Numbers = Numbers(0, Seq.empty, Seq.empty)
