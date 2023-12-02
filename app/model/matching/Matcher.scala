package model.matching

trait CertainMatcher[T]:

  protected def checkCertainMatch(left: T, right: T): Boolean

  private def emptyCertainMatchingResult(userSolution: Seq[T]): CertainMatchingResult[T] = CertainMatchingResult(Seq.empty, Seq.empty, userSolution)

  // Certain matching

  private def findAndRemove(xs: List[T], f: T => Boolean): Option[(T, List[T])] = {
    @scala.annotation.tailrec
    def go(remaining: List[T], prior: List[T]): Option[(T, List[T])] = remaining match {
      case Nil          => None
      case head :: tail => if (f(head)) Some((head, prior ++ tail)) else go(tail, prior :+ head)
    }

    go(xs, List.empty)
  }

  private def extendMatchingResult(m: CertainMatchingResult[T], head: T): CertainMatchingResult[T] =
    findAndRemove(m.notMatchedUser.toList, checkCertainMatch(head, _)) match {
      case None                           => m.copy(notMatchedSample = m.notMatchedSample :+ head)
      case Some((userNode, newUserNodes)) => m.copy(matches = m.matches :+ CertainMatch(head, userNode), notMatchedUser = newUserNodes)
    }

  def performCertainMatching(sampleSolution: Seq[T], userSolution: Seq[T]): CertainMatchingResult[T] =
    sampleSolution.foldLeft(emptyCertainMatchingResult(userSolution))(extendMatchingResult)
