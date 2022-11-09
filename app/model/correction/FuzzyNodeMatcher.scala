package model.correction

import model.FlatSolutionNode
import model.correction.CertainNounMatcher.NounMatchingResult

final case class ExtractedNoun(start: Int, end: Int, matched: String)

object FuzzyNodeMatcher extends FuzzyMatcher {

  override protected val certaintyThreshold: Double = 0.2

  override protected type T = FlatSolutionNode
  override protected type E = NounMatchingResult

  override protected def generateMatchExplanation(sampleValue: FlatSolutionNode, userValue: FlatSolutionNode): NounMatchingResult =
    CertainNounMatcher.matchFromTexts(sampleValue.text, userValue.text)

  override def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E] = sampleSolution
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
