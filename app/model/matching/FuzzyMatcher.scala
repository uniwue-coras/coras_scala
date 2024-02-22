package model.matching

import scala.annotation.tailrec

trait FuzzyMatcher[T, ExplanationType <: MatchExplanation] extends Matcher[T, ExplanationType]:

  protected val defaultCertaintyThreshold: Double

  def generateFuzzyMatchExplanation(sample: T, user: T): ExplanationType

  // Fuzzy matching

  private def intermediateMatchingResultQuality(mr: MatchingResult[T, ExplanationType]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.explanation.map(_.certainty).getOrElse(1.0)
  }

  private type MatchGenerationResult = Seq[(Match[T, ExplanationType], Seq[T])]

  private def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T], certaintyThreshold: Double): MatchGenerationResult = {

    @tailrec
    def go(prior: Seq[T], remaining: List[T], acc: MatchGenerationResult): MatchGenerationResult = remaining match
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = Some(generateFuzzyMatchExplanation(sampleNode, head))
          .filter { explanation => explanation.certainty > certaintyThreshold }
          .map { explanation => (Match(sampleNode, head, Some(explanation)), prior ++ tail) }

        go(prior :+ head, tail, acc ++ maybeNewMatch)

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  private def performInternalFuzzyMatching(sampleSolution: Seq[T], userSolution: Seq[T], certaintyThreshold: Double): MatchingResult[T, ExplanationType] =
    sampleSolution
      .foldLeft(Seq(emptyMatchingResult(userSolution))) { case (matchingResults, sampleNode) =>
        matchingResults.flatMap { case MatchingResult(matches, notMatchedSample, notMatchedUser) =>
          val allNewMatches = for {
            (theMatch, newNotMatchedUser) <- generateAllMatchesForSampleNode(sampleNode, notMatchedUser, certaintyThreshold)
          } yield MatchingResult(matches :+ theMatch, notMatchedSample, newNotMatchedUser)

          allNewMatches :+ MatchingResult(matches, notMatchedSample :+ sampleNode, notMatchedUser)
        }
      }
      .maxByOption(intermediateMatchingResultQuality)
      .getOrElse(MatchingResult(Seq.empty, Seq.empty, Seq.empty))

  def performMatching(
    sampleSolution: Seq[T],
    userSolution: Seq[T],
    certaintyThreshold: Double = defaultCertaintyThreshold
  ): MatchingResult[T, ExplanationType] = {
    // Equality matching
    val MatchingResult(certainMatches, notMatchedSample, notMatchedUser) = performCertainMatching(sampleSolution, userSolution)

    // Similarity matching
    val MatchingResult(fuzzyMatches, newNotMatchedSample, newNotMatchedUser) =
      performInternalFuzzyMatching(notMatchedSample, notMatchedUser, certaintyThreshold)

    MatchingResult(certainMatches ++ fuzzyMatches, newNotMatchedSample, newNotMatchedUser)
  }
