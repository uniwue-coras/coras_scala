package model.matching

trait FuzzyMatcher[T, ExplanationType <: MatchExplanation](protected val certaintyThreshold: Double) extends CertainMatcher[T]:

  protected def generateFuzzyMatchExplanation(sample: T, user: T): ExplanationType

  private def emptyFuzzyMatchingResult(certainMatches: Seq[CertainMatch[T]], userSolution: Seq[T]): CompleteMatchingResult[T, ExplanationType] =
    CompleteMatchingResult(certainMatches, Seq.empty, Seq.empty, userSolution)

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): CompleteMatchingResult[T, ExplanationType] = {
    // Equality matching
    val CertainMatchingResult(certainMatches, notMatchedSample, notMatchedUser) = performCertainMatching(sampleSolution, userSolution)

    // Similarity matching
    performFuzzyMatching(certainMatches, notMatchedSample, notMatchedUser)
  }

  // Fuzzy matching

  private def intermediateMatchingResultQuality(mr: CompleteMatchingResult[T, ExplanationType]): Double = mr.fuzzyMatches.map(_.explanation.certainty).sum

  private type MatchGenerationResult = Seq[(FuzzyMatch[T, ExplanationType], Seq[T])]

  private def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): MatchGenerationResult = {
    @scala.annotation.tailrec
    def go(prior: Seq[T], remaining: List[T], acc: MatchGenerationResult): MatchGenerationResult = remaining match {
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = Some(generateFuzzyMatchExplanation(sampleNode, head))
          .filter { explanation => explanation.certainty > certaintyThreshold }
          .map { explanation => (FuzzyMatch(sampleNode, head, explanation), prior ++ tail) }

        go(prior :+ head, tail, acc ++ maybeNewMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  private def performFuzzyMatching(
    certainMatches: Seq[CertainMatch[T]],
    sampleSolution: Seq[T],
    userSolution: Seq[T]
  ): CompleteMatchingResult[T, ExplanationType] =
    sampleSolution
      .foldLeft(Seq(emptyFuzzyMatchingResult(certainMatches, userSolution))) { case (matchingResults, sampleNode) =>
        matchingResults.flatMap { case CompleteMatchingResult(certainMatches, fuzzyMatches, notMatchedSample, notMatchedUser) =>
          val allNewMatchingResults = for {
            (theMatch, newNotMatchedUser) <- generateAllMatchesForSampleNode(sampleNode, notMatchedUser)
          } yield CompleteMatchingResult(certainMatches, fuzzyMatches :+ theMatch, notMatchedSample, newNotMatchedUser)

          allNewMatchingResults :+ CompleteMatchingResult(certainMatches, fuzzyMatches, notMatchedSample :+ sampleNode, notMatchedUser)
        }
      }
      .maxByOption(intermediateMatchingResultQuality)
      .getOrElse(CompleteMatchingResult(Seq.empty, Seq.empty, Seq.empty))
