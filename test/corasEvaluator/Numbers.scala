package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation}

final case class FalseNegativeDebugExplanation(
  sampleText: String,
  userText: String,
  maybeCertainty: Option[Double]
)

final case class FalsePositiveDebugExplanation(
  sampleText: String,
  userText: String,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
)

final case class Numbers(
  truePositiveCount: Int,
  falsePositiveTexts: Seq[FalsePositiveDebugExplanation],
  falseNegativeTexts: Seq[FalseNegativeDebugExplanation]
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
