package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation}

final case class FalseNegativeDebugExplanation(
  sampleText: String,
  userText: String,
  maybeCertainty: Option[Double]
)

final case class CertainFalsePositiveDebugExplanation(
  sampleText: String,
  userText: String
)

final case class FuzzyFalsePositiveDebugExplanation(
  sampleText: String,
  userText: String,
  explanation: SolutionNodeMatchExplanation
)

final case class Numbers(
  truePositiveCount: Int,
  certainFalsePositiveTexts: Seq[CertainFalsePositiveDebugExplanation],
  fuzzyFalsePositiveTexts: Seq[FuzzyFalsePositiveDebugExplanation],
  falseNegativeTexts: Seq[FalseNegativeDebugExplanation]
) {

  val falsePositiveCount = certainFalsePositiveTexts.length + fuzzyFalsePositiveTexts.length
  val falseNegativeCount = falseNegativeTexts.length

  lazy val precisionPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePositiveCount) / (2 * truePositiveCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePositiveCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: Numbers): Numbers = Numbers(
    this.truePositiveCount + that.truePositiveCount,
    this.certainFalsePositiveTexts ++ that.certainFalsePositiveTexts,
    this.fuzzyFalsePositiveTexts ++ that.fuzzyFalsePositiveTexts,
    this.falseNegativeTexts ++ that.falseNegativeTexts
  )

}

object Numbers:
  def zero: Numbers = Numbers(0, Seq.empty, Seq.empty, Seq.empty)
