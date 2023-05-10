package model.matching

trait Matcher[T, E] {

  protected val checkCertainMatch: (T, T) => Boolean
  protected val generateFuzzyMatchExplanation: (T, T) => E
  protected val fuzzyMatchingRate: E => Double
  protected val certaintyThreshold: Double

  private def emptyMatchingResult(userSolution: Seq[T]): MatchingResult[T, E] = MatchingResult(Seq.empty, Seq.empty, userSolution)

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] = {
    // Equality matching
    val MatchingResult(certainMatches, notMatchedSample, notMatchedUser) = performCertainMatching(sampleSolution, userSolution)

    // Similarity matching
    val MatchingResult(fuzzyMatches, newNotMatchedSample, newNotMatchedUser) = performFuzzyMatching(notMatchedSample, notMatchedUser)

    MatchingResult(certainMatches ++ fuzzyMatches, newNotMatchedSample, newNotMatchedUser)
  }

  // Certain matching

  private def findAndRemove(xs: List[T], f: T => Boolean): Option[(T, List[T])] = {
    @scala.annotation.tailrec
    def go(remaining: List[T], prior: List[T]): Option[(T, List[T])] = remaining match {
      case Nil          => None
      case head :: tail => if (f(head)) Some((head, prior ++ tail)) else go(tail, prior :+ head)
    }

    go(xs, List.empty)
  }

  private def extendMatchingResult(
    m: MatchingResult[T, E],
    head: T
  ): MatchingResult[T, E] = findAndRemove(m.notMatchedUser.toList, checkCertainMatch(head, _)) match {
    case None                           => MatchingResult(m.matches, m.notMatchedSample :+ head, m.notMatchedUser)
    case Some((userNode, newUserNodes)) => MatchingResult(m.matches :+ Match(head, userNode, None), m.notMatchedSample, newUserNodes)
  }

  private def performCertainMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] =
    sampleSolution.foldLeft(emptyMatchingResult(userSolution))(extendMatchingResult)

  // Fuzzy matching

  private def intermediateMatchingResultQuality(mr: MatchingResult[T, E]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.explanation.map(fuzzyMatchingRate).getOrElse(1.0)
  }

  private type MatchGenerationResult = Seq[(Match[T, E], Seq[T])]

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

  private def performFuzzyMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] = sampleSolution
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
