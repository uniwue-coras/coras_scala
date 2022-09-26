package model.matching

import model.FlatSolutionNode

object CertainNodeMatcher {

  private def findUserSolutionMatch(
    sampleSolutionNode: FlatSolutionNode,
    userSolution: List[FlatSolutionNode]
  ): Option[(FlatSolutionNode, List[FlatSolutionNode])] = {

    @scala.annotation.tailrec
    def go(remainingUserNodes: List[FlatSolutionNode], checkedUserNodes: List[FlatSolutionNode]): Option[(FlatSolutionNode, List[FlatSolutionNode])] =
      remainingUserNodes match {
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

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): MatchingResult[FlatSolutionNode] = {

    @scala.annotation.tailrec
    def go(
      remainingSampleNodes: List[FlatSolutionNode],
      remainingUserNodes: List[FlatSolutionNode],
      matches: Seq[NodeMatch],
      notMatchedSample: Seq[FlatSolutionNode]
    ): MatchingResult[FlatSolutionNode] = remainingSampleNodes match {
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
