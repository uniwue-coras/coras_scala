package model.correction

abstract class Matcher[T, E /* <: MatchingResult[_, _]*/ ](
  checkCertainMatch: (T, T) => Boolean,
  generateFuzzyMatchExplanation: (T, T) => E,
  fuzzyMatchingRate: E => Double
) {

  protected def emptyMatchingResult(userSolution: Seq[T]): MatchingResult[T, E] = MatchingResult(Seq.empty, Seq.empty, userSolution)

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] = {
    // Equality matching
    val MatchingResult(matches, notMatchedSample, notMatchedUser) = performCertainMatching(sampleSolution, userSolution)

    // Similarity matching
    val MatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) = performFuzzyMatching(notMatchedSample, notMatchedUser)

    MatchingResult(matches ++ newMatches, newNotMatchedSample, newNotMatchedUser)
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

  private def performCertainMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] =
    sampleSolution.foldLeft(emptyMatchingResult(userSolution)) { case (MatchingResult(matches, notMatchedSample, notMatchedUser), head) =>
      findAndRemove(notMatchedUser.toList, checkCertainMatch(head, _)) match {
        case None                           => MatchingResult(matches, notMatchedSample :+ head, notMatchedUser)
        case Some((userNode, newUserNodes)) => MatchingResult(matches :+ Match(head, userNode, None), notMatchedSample, newUserNodes)
      }
    }

  // Fuzzy matching

  protected val certaintyThreshold: Double = 0.2

  private type MatchGenerationResult = Seq[(Match[T, E], Seq[T])]

  protected def intermediateMatchingResultQuality(mr: MatchingResult[T, E]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.explanation.map(fuzzyMatchingRate).getOrElse(1.0)
  }

  protected def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): MatchGenerationResult = {
    @scala.annotation.tailrec
    def go(prior: Seq[T], remaining: List[T], acc: MatchGenerationResult): MatchGenerationResult = remaining match {
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = generateFuzzyMatchExplanation(sampleNode, head) match {
          case m if fuzzyMatchingRate(m) > certaintyThreshold => Some((Match(sampleNode, head, Some(m)), prior ++ tail))
          case _                                              => None
        }

        go(prior :+ head, tail, acc ++ maybeNewMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  private def performFuzzyMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] = sampleSolution
    .foldLeft(Seq(emptyMatchingResult(userSolution))) { case (matchingResults, sampleNode) =>
      matchingResults.flatMap { case MatchingResult(matches, notMatchedSample, notMatchedUser) =>
        val allNewMatches = for {
          (theMatch: Match[T, E], newNotMatchedUser) <- generateAllMatchesForSampleNode(sampleNode, notMatchedUser)
        } yield MatchingResult(matches :+ theMatch, notMatchedSample, newNotMatchedUser)

        allNewMatches :+ MatchingResult(matches, notMatchedSample :+ sampleNode, notMatchedUser)
      }
    }
    .maxByOption(intermediateMatchingResultQuality)
    .getOrElse(MatchingResult(Seq.empty, Seq.empty, Seq.empty))

}
