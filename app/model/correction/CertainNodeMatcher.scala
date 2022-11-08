package model.correction

import model.FlatSolutionNode

trait CertainMatcher extends Matcher {

  protected def checkMatch(left: T, right: T): Boolean

  override final def performMatching(
    sampleSolution: Seq[T],
    userSolution: Seq[T]
  ): MatchingResult[T] = sampleSolution.foldLeft(emptyMatchingResult(userSolution)) { case (MatchingResult(matches, notMatchedSample, notMatchedUser), head) =>
    findAndRemove(notMatchedUser.toList, checkMatch(head, _)) match {
      case None                           => MatchingResult(matches, notMatchedSample :+ head, notMatchedUser)
      case Some((userNode, newUserNodes)) => MatchingResult(matches :+ Match(head, userNode, None), notMatchedSample, newUserNodes)
    }
  }

}

object CertainNodeMatcher extends CertainMatcher {

  override protected type T = FlatSolutionNode

  override protected def checkMatch(left: FlatSolutionNode, right: FlatSolutionNode): Boolean = left.text.trim == right.text.trim

}
