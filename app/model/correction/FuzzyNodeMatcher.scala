package model.correction

import model.FlatSolutionNode

final case class ExtractedNoun(start: Int, end: Int, matched: String)

final case class MatchExplanation(
  certainty: Double
)

object FuzzyNodeMatcher extends Matcher {

  private val certaintyThreshold: Double = 0.2

  override protected type T = FlatSolutionNode

  private type MatchGenerationResult = (Match[T], Seq[T])

  private def intermediateMatchingResultQuality(mr: MatchingResult[T]): Double = mr.matches.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.certainty.getOrElse(1.0)
  }

  private def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): Seq[MatchGenerationResult] = {

    @scala.annotation.tailrec
    def go(prior: Seq[T], remaining: List[T], acc: Seq[MatchGenerationResult]): Seq[MatchGenerationResult] = remaining match {
      case Nil => acc
      case head :: tail =>
        val maybeNewMatch = NounMatcher.matchFromTexts(sampleNode.text, head.text) match {
          case m if m.rate > certaintyThreshold => Some((Match(sampleNode, head, Some(m.rate)), prior ++ tail))
          case _                                => None
        }

        go(prior :+ head, tail, acc ++ maybeNewMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  override def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T] = sampleSolution
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
