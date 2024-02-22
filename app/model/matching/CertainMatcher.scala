package model.matching

trait CertainMatcher[T, ExplanationType <: MatchExplanation] extends Matcher[T, ExplanationType]:
  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] = performCertainMatching(sampleSolution, userSolution)
