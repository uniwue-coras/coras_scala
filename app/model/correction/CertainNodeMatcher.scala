package model.correction

import model.FlatSolutionNode

object CertainNodeMatcher {

  private type T = FlatSolutionNode

  private def findUserSolutionMatch(sampleSolutionNode: T, userSolution: List[T]): Option[(T, List[T])] = {

    @scala.annotation.tailrec
    def go(remainingUserNodes: List[T], checkedUserNodes: List[T]): Option[(T, List[T])] = remainingUserNodes match {
      case Nil => None
      case head :: tail =>
        if (sampleSolutionNode.text.trim == head.text.trim) {
          Some((head, checkedUserNodes ++ tail))
        } else {
          go(tail, checkedUserNodes :+ head)
        }
    }

    go(userSolution, List.empty)
  }

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T] = {

    @scala.annotation.tailrec
    def go(remainingSampleNodes: List[T], remainingUserNodes: List[T], matches: Seq[NodeMatch], notMatchedSample: Seq[T]): MatchingResult[T] =
      remainingSampleNodes match {
        case Nil => MatchingResult(matches, notMatchedSample, remainingUserNodes)
        case head :: tail =>
          findUserSolutionMatch(head, remainingUserNodes) match {
            case None                                    => go(tail, remainingUserNodes, matches, notMatchedSample :+ head)
            case Some((userNode, newRemainingUserNodes)) => go(tail, newRemainingUserNodes, matches :+ NodeMatch(head.id, userNode.id, None), notMatchedSample)
          }
      }

    go(sampleSolution.toList, userSolution.toList, Seq.empty, Seq.empty)
  }

}
