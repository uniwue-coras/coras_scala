package model.matching

import model.FlatSolutionNode

object FuzzyNodeMatcher {

  private val nounRegex = "\\p{Lu}\\p{L}+".r

  private val certaintyThreshold: Double = 0.2

  private type MatchGenerationResult = (NodeMatch, Seq[FlatSolutionNode])

  private type IntermediateMatchingResult = (Seq[NodeMatch], Seq[FlatSolutionNode], Seq[FlatSolutionNode])

  private def intermediateMatchingResultQuality(mr: IntermediateMatchingResult): Double = mr._1.foldLeft(0.0) { case (acc, mr) =>
    acc + mr.certainty.getOrElse(1.0)
  }

  private def extractNouns(text: String): Seq[String] = nounRegex.findAllIn(text).toSeq

  private val intermediateMatchingResultOrdering: Ordering[IntermediateMatchingResult] = (a, b) =>
    intermediateMatchingResultQuality(a) compareTo intermediateMatchingResultQuality(b)

  private def estimateMatchCertainty(sampleNode: FlatSolutionNode, userNode: FlatSolutionNode): Double = {
    val sampleNouns = extractNouns(sampleNode.text).toSet
    val userNouns   = extractNouns(userNode.text).toSet

    (sampleNouns & userNouns).size match {
      case 0            => 0.0
      case intersection => intersection.toDouble / (sampleNouns | userNouns).size.toDouble
    }
  }

  private def generateAllMatchesForSampleNode(sampleNode: FlatSolutionNode, userSolution: Seq[FlatSolutionNode]): Seq[MatchGenerationResult] = {
    @scala.annotation.tailrec
    def go(prior: Seq[FlatSolutionNode], remaining: List[FlatSolutionNode], acc: Seq[MatchGenerationResult]): Seq[MatchGenerationResult] = remaining match {
      case Nil => acc
      case head :: tail =>
        val certainty = estimateMatchCertainty(sampleNode, head)

        val newMatch = if (certainty > certaintyThreshold) {
          Some((NodeMatch(sampleNode.id, head.id, Some(certainty)), prior ++ tail))
        } else {
          None
        }

        go(prior :+ head, tail, acc ++ newMatch)
    }

    go(Seq.empty, userSolution.toList, Seq.empty)
  }

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): MatchingResult[FlatSolutionNode] = {

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
