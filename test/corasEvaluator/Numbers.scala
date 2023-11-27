package corasEvaluator

final case class Numbers(
  truePositiveCount: Int,
  certainFalsePositiveTexts: Seq[CertainDebugExplanation],
  fuzzyFalsePositiveTexts: Seq[FuzzyFalsePositiveDebugExplanation],
  certainFalseNegativeTexts: Seq[CertainDebugExplanation],
  fuzzyFalseNegativeTexts: Seq[FuzzyFalseNegativeDebugExplanation]
) {

  val falsePositiveCount = certainFalsePositiveTexts.length + fuzzyFalsePositiveTexts.length
  val falseNegativeCount = certainFalseNegativeTexts.length + fuzzyFalseNegativeTexts.length

  lazy val precisionPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePositiveCount.toDouble / (truePositiveCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePositiveCount) / (2 * truePositiveCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePositiveCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: Numbers): Numbers = Numbers(
    this.truePositiveCount + that.truePositiveCount,
    this.certainFalsePositiveTexts ++ that.certainFalsePositiveTexts,
    this.fuzzyFalsePositiveTexts ++ that.fuzzyFalsePositiveTexts,
    this.certainFalseNegativeTexts ++ that.certainFalseNegativeTexts,
    this.fuzzyFalseNegativeTexts ++ that.fuzzyFalseNegativeTexts
  )

}

object Numbers:
  def zero: Numbers = Numbers(0, Seq.empty, Seq.empty, Seq.empty, Seq.empty)
