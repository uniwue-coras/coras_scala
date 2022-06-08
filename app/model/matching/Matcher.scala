package model.matching

import scala.annotation.tailrec

trait Match[T] {
  val sampleValue: T
  val userValue: T
}

trait MatchingResult[T, M <: Match[T]] {
  val matches: Seq[M]
  val notMatchedSample: Seq[T]
  val notMatchedUser: Seq[T]
}

trait Matcher[T, M <: Match[T], MR <: MatchingResult[T, M]] {

  protected def matches(sampleValue: T, userValue: T): Boolean

  protected def createMatch(sampleValue: T, userValue: T): M

  protected def createMatchingResult(matches: Seq[M], notMatchedSample: Seq[T], notMatchedUser: Seq[T]): MR

  protected def findUserSolutionMatch(sampleSolutionNode: T, userSolution: List[T]): Option[(T, List[T])] = {

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

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MR = {

    @tailrec
    def go(remainingSampleNodes: List[T], remainingUserNodes: List[T], matches: Seq[M], notMatchedSample: Seq[T]): MR = remainingSampleNodes match {
      case Nil => createMatchingResult(matches, notMatchedSample, remainingUserNodes)
      case head :: tail =>
        findUserSolutionMatch(head, remainingUserNodes) match {
          case None                                    => go(tail, remainingUserNodes, matches, notMatchedSample :+ head)
          case Some((userNode, newRemainingUserNodes)) => go(tail, newRemainingUserNodes, matches :+ createMatch(head, userNode), notMatchedSample)
        }
    }

    go(sampleSolution.toList, userSolution.toList, Seq.empty, Seq.empty)
  }

}
