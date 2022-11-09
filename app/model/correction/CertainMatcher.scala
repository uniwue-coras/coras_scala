package model.correction

trait CertainMatcher extends Matcher {

  protected def checkMatch(left: T, right: T): Boolean

  override final def performMatching(
    sampleSolution: Seq[T],
    userSolution: Seq[T]
  ): MatchingResult[T, E] = sampleSolution.foldLeft(emptyMatchingResult(userSolution)) {
    case (MatchingResult(matches, notMatchedSample, notMatchedUser), head) =>
      findAndRemove(notMatchedUser.toList, checkMatch(head, _)) match {
        case None                           => MatchingResult(matches, notMatchedSample :+ head, notMatchedUser)
        case Some((userNode, newUserNodes)) => MatchingResult(matches :+ Match(head, userNode, None), notMatchedSample, newUserNodes)
      }
  }

}
