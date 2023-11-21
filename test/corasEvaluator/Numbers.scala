package corasEvaluator

import play.api.libs.json.{Json, OFormat}

final case class TextsForComparison(
  sample: String,
  user: String,
  certainty: Double
)

object TextsForComparison {
  val jsonFormat: OFormat[TextsForComparison] = Json.format
}

final case class Numbers(
  truePositiveCount: Int,
  falsePositiveCount: Int,
  falseNegativeCount: Int,
  falsePositiveTexts: Seq[TextsForComparison]
) {

  lazy val precisionPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePositiveCount) / (2 * truePositiveCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePositiveCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: Numbers): Numbers = Numbers(
    this.truePositiveCount + that.truePositiveCount,
    this.falsePositiveCount + that.falsePositiveCount,
    this.falseNegativeCount + that.falseNegativeCount,
    this.falsePositiveTexts ++ that.falsePositiveTexts
  )

}

object Numbers {
  def zero: Numbers = Numbers(0, 0, 0, Seq.empty)
}
