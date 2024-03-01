package model.matching

trait CertainMatcher[T, ExplanationType <: MatchExplanation] extends Matcher[T, ExplanationType]:
  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] = performCertainMatching(sampleSolution, userSolution)

  def performMatchingIfNotEmpty(sampleSolution: Seq[T], userSolution: Seq[T]): Option[MatchingResult[T, ExplanationType]] =
    if sampleSolution.isEmpty && userSolution.isEmpty then None else Some(performMatching(sampleSolution, userSolution))
