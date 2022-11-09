package model.correction

trait FuzzyMatcher extends Matcher {

  protected val certaintyThreshold: Double

  override protected type E <: MatchingResult[_, _]

  private type MatchGenerationResult = (Match[T, E], Seq[T])

  protected def generateMatchExplanation(sampleValue: T, userValue: T): E

  protected def intermediateMatchingResultQuality(mr: MatchingResult[T, E]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.explanation.map(_.rate).getOrElse(1.0)
  }

  protected def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): Seq[MatchGenerationResult] = {

    @scala.annotation.tailrec
    def go(prior: Seq[T], remaining: List[T], acc: Seq[MatchGenerationResult]): Seq[MatchGenerationResult] = remaining match {
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = generateMatchExplanation(sampleNode, head) match {
          case m if m.rate > certaintyThreshold => Some((Match(sampleNode, head, Some(m)), prior ++ tail))
          case _                                => None
        }

        go(prior :+ head, tail, acc ++ maybeNewMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

}
