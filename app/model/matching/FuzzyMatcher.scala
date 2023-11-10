package model.matching

trait FuzzyMatcher[T, ExplanationType] extends Matcher[T, ExplanationType] {

  protected val certaintyThreshold: Double

  protected def generateFuzzyMatchExplanation(left: T, right: T): ExplanationType
  protected def fuzzyMatchingRate(explanation: ExplanationType): Double

  override def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] = {
    // Equality matching
    val MatchingResult(certainMatches, notMatchedSample, notMatchedUser) = super.performMatching(sampleSolution, userSolution)

    // Similarity matching
    val MatchingResult(fuzzyMatches, newNotMatchedSample, newNotMatchedUser) = performFuzzyMatching(notMatchedSample, notMatchedUser)

    MatchingResult(certainMatches ++ fuzzyMatches, newNotMatchedSample, newNotMatchedUser)
  }

  // Fuzzy matching

  private def intermediateMatchingResultQuality(mr: MatchingResult[T, ExplanationType]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.explanation.map(fuzzyMatchingRate).getOrElse(1.0)
  }

  private type MatchGenerationResult = Seq[(Match[T, ExplanationType], Seq[T])]

  private def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): MatchGenerationResult = {
    @scala.annotation.tailrec
    def go(prior: Seq[T], remaining: List[T], acc: MatchGenerationResult): MatchGenerationResult = remaining match {
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = Some(generateFuzzyMatchExplanation(sampleNode, head))
          .filter { explanation => fuzzyMatchingRate(explanation) > certaintyThreshold }
          .map { explanation => (Match(sampleNode, head, Some(explanation)), prior ++ tail) }

        go(prior :+ head, tail, acc ++ maybeNewMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  private def performFuzzyMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] = sampleSolution
    .foldLeft(Seq(emptyMatchingResult(userSolution))) { case (matchingResults, sampleNode) =>
      matchingResults.flatMap { case MatchingResult(matches, notMatchedSample, notMatchedUser) =>
        val allNewMatches = for {
          (theMatch, newNotMatchedUser) <- generateAllMatchesForSampleNode(sampleNode, notMatchedUser)
        } yield MatchingResult(matches :+ theMatch, notMatchedSample, newNotMatchedUser)

        allNewMatches :+ MatchingResult(matches, notMatchedSample :+ sampleNode, notMatchedUser)
      }
    }
    .maxByOption(intermediateMatchingResultQuality)
    .getOrElse(MatchingResult(Seq.empty, Seq.empty, Seq.empty))

}
