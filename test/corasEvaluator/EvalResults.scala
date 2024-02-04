package corasEvaluator

final case class EvalNumbers(truePosCount: Int, certainFalsePosCount: Int, fuzzyFalsePosCount: Int, certainFalseNegCount: Int, fuzzyFalseNegCount: Int):

  def falsePositiveCount = certainFalsePosCount + fuzzyFalsePosCount
  def falseNegativeCount = certainFalseNegCount + fuzzyFalseNegCount

  lazy val precisionPercent: Double = (truePosCount.toDouble / (truePosCount + falsePositiveCount).toDouble * 1000.0).toInt / 10.0

  lazy val recallPercent: Double = (truePosCount.toDouble / (truePosCount + falseNegativeCount).toDouble * 1000.0).toInt / 10.0

  lazy val f1: Double = ((2 * truePosCount) / (2 * truePosCount + falsePositiveCount + falseNegativeCount).toDouble * 100.0).toInt / 100.0

  def evaluation: String =
    s"Precision: ${precisionPercent}%, Recall: ${recallPercent}%, F1: ${f1} (TruePos: $truePosCount / FalsePos: $falsePositiveCount / FalseNeg: $falseNegativeCount)"

  def +(that: EvalNumbers) = EvalNumbers(
    this.truePosCount + that.truePosCount,
    this.certainFalsePosCount + that.certainFalsePosCount,
    this.fuzzyFalsePosCount + that.fuzzyFalsePosCount,
    this.certainFalseNegCount + that.certainFalseNegCount,
    this.falseNegativeCount + that.falseNegativeCount
  )
