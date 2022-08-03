package model.matching

import scala.annotation.tailrec

trait CertainMatcher[T] extends Matcher[T] {

  protected def matches(sampleValue: T, userValue: T): Boolean

  private def findUserSolutionMatch(sampleSolutionNode: T, userSolution: List[T]): Option[(T, List[T])] = {

    @tailrec
    def go(remainingUserNodes: List[T], checkedUserNodes: List[T]): Option[(T, List[T])] = remainingUserNodes match {
      case Nil => None
      case head :: tail =>
        if (matches(sampleSolutionNode, head)) {
          Some((head, checkedUserNodes ++ tail))
        } else {
          go(tail, checkedUserNodes :+ head)
        }
    }

    go(userSolution, List.empty)
  }

  override def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T] = {

    @tailrec
    def go(
      remainingSampleNodes: List[T],
      remainingUserNodes: List[T],
      matches: Seq[CertainMatch[T]],
      notMatchedSample: Seq[T]
    ): MatchingResult[T] = remainingSampleNodes match {
      case Nil => MatchingResult(matches, notMatchedSample, remainingUserNodes)
      case head :: tail =>
        findUserSolutionMatch(head, remainingUserNodes) match {
          case None                                    => go(tail, remainingUserNodes, matches, notMatchedSample :+ head)
          case Some((userNode, newRemainingUserNodes)) => go(tail, newRemainingUserNodes, matches :+ CertainMatch(head, userNode), notMatchedSample)
        }
    }

    go(sampleSolution.toList, userSolution.toList, Seq.empty, Seq.empty)
  }

}
