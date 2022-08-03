package model.matching

import scala.annotation.tailrec

trait FuzzyMatcher[T] extends Matcher[T] {

  protected val certaintyThreshold: Double

  private type MatchGenerationResult = (FuzzyMatch[T], Seq[T])

  private type IntermediateMatchingResult = (Seq[FuzzyMatch[T]], Seq[T], Seq[T])

  private def intermediateMatchingResultQuality(mr: IntermediateMatchingResult): Double = mr._1.foldLeft(0.0) { case (acc, mr) => acc + mr.certainty }

  private val intermediateMatchingResultOrdering: Ordering[IntermediateMatchingResult] = (a, b) =>
    intermediateMatchingResultQuality(a) compareTo intermediateMatchingResultQuality(b)

  protected def estimateMatchCertainty(sampleNode: T, userNode: T): Double

  private def generateAllMatchesForSampleNode(sampleNode: T, userSolution: Seq[T]): Seq[MatchGenerationResult] = {
    @tailrec
    def go(prior: Seq[T], remaining: List[T], acc: Seq[MatchGenerationResult]): Seq[MatchGenerationResult] = remaining match {
      case Nil => acc
      case head :: tail =>
        val certainty = estimateMatchCertainty(sampleNode, head)

        val newMatch = if (certainty > certaintyThreshold) {
          Some((FuzzyMatch(sampleNode, head, certainty), prior ++ tail))
        } else {
          None
        }

        go(prior :+ head, tail, acc ++ newMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  override def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T] = {

    val emptyMatchingResult: IntermediateMatchingResult = (Seq.empty, Seq.empty, userSolution)

    val (matches, notMatchedSample, notMatchedUser) = sampleSolution
      .foldLeft(Seq(emptyMatchingResult)) { case (matchingResults, sampleNode) =>
        matchingResults.flatMap { case (matches, notMatchedSample, notMatchedUser) =>
          val allNewMatches = for {
            (theMatch, newNotMatchedUser) <- generateAllMatchesForSampleNode(sampleNode, notMatchedUser)
          } yield (matches :+ theMatch, notMatchedSample, newNotMatchedUser)

          allNewMatches :+ (matches, notMatchedSample :+ sampleNode, notMatchedUser)
        }
      }
      .sorted(intermediateMatchingResultOrdering)
      .reverse
      .headOption
      .getOrElse((Seq.empty, Seq.empty, Seq.empty))

    MatchingResult(matches, notMatchedSample, notMatchedUser)
  }

}
