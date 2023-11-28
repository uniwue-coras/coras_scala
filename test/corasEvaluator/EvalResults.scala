package corasEvaluator

final case class Numbers(
  truePositiveCount: Int,
  falsePositiveCount: Int,
  falseNegativeCount: Int
):
  lazy val precisionPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePositiveCount) / (2 * truePositiveCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePositiveCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: Numbers) = Numbers(
    this.truePositiveCount + that.truePositiveCount,
    this.falsePositiveCount + that.falsePositiveCount,
    this.falseNegativeCount + that.falseNegativeCount
  )

final case class EvalResults(
  truePositiveCount: Int,
  foundMatching: Seq[EvaluationNodeMatch],
  certainFalsePositiveTexts: Seq[CertainDebugExplanation],
  fuzzyFalsePositiveTexts: Seq[FuzzyFalsePositiveDebugExplanation],
  certainFalseNegativeTexts: Seq[CertainDebugExplanation],
  fuzzyFalseNegativeTexts: Seq[FuzzyFalseNegativeDebugExplanation]
):
  lazy val numbers: Numbers = Numbers(
    truePositiveCount,
    falsePositiveCount = certainFalsePositiveTexts.length + fuzzyFalsePositiveTexts.length,
    falseNegativeCount = certainFalseNegativeTexts.length + fuzzyFalseNegativeTexts.length
  )
