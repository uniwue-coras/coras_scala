package model.matching

trait Matcher[T, ExplanationType <: MatchExplanation]:

  protected def checkCertainMatch(left: T, right: T): Boolean

  protected def emptyMatchingResult(userSolution: Seq[T]): MatchingResult[T, ExplanationType] = MatchingResult(Seq.empty, Seq.empty, userSolution)

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] = performCertainMatching(sampleSolution, userSolution)

  // Certain matching

  private def findAndRemove(xs: List[T], f: T => Boolean): Option[(T, List[T])] = {
    @scala.annotation.tailrec
    def go(remaining: List[T], prior: List[T]): Option[(T, List[T])] = remaining match {
      case Nil          => None
      case head :: tail => if (f(head)) Some((head, prior ++ tail)) else go(tail, prior :+ head)
    }

    go(xs, List.empty)
  }

  private def extendMatchingResult(
    m: MatchingResult[T, ExplanationType],
    head: T
  ): MatchingResult[T, ExplanationType] = findAndRemove(m.notMatchedUser.toList, checkCertainMatch(head, _)) match {
    case None                           => MatchingResult(m.matches, m.notMatchedSample :+ head, m.notMatchedUser)
    case Some((userNode, newUserNodes)) => MatchingResult(m.matches :+ Match(head, userNode, None), m.notMatchedSample, newUserNodes)
  }

  private def performCertainMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, ExplanationType] =
    sampleSolution.foldLeft(emptyMatchingResult(userSolution))(extendMatchingResult)
