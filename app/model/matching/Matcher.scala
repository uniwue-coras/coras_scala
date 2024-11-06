package model.matching

trait Matcher[T, ExplanationType <: MatchExplanation] {

  protected def checkCertainMatch(left: T, right: T): Boolean

  protected def emptyMatchingResult(userSolution: Seq[T]): MatchingResult[T, ExplanationType] = MatchingResult(Seq.empty, Seq.empty, userSolution)

  // Certain matching

  private def findAndRemove(xs: List[T], f: T => Boolean): Option[(T, List[T])] = {
    xs.partition(a => !f(a)) match {
      case (prefix, hit :: suffix) => Some(hit, prefix ++ suffix)
      case (prefix, Nil)           => None
    }
  }

  private def extendMatchingResult(m: MatchingResult[T, ExplanationType], head: T): MatchingResult[T, ExplanationType] =
    findAndRemove(m.notMatchedUser.toList, checkCertainMatch(head, _)) match {
      case None                           => MatchingResult(m.matches, m.notMatchedSample :+ head, m.notMatchedUser)
      case Some((userNode, newUserNodes)) => MatchingResult(m.matches :+ Match(head, userNode, None), m.notMatchedSample, newUserNodes)
    }

  protected def performCertainMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] =
    sampleSolution.foldLeft(emptyMatchingResult(userSolution))(extendMatchingResult)
}
