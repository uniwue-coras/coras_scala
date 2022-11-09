package model.correction

trait Matcher {

  protected type T
  protected type E

  protected def emptyMatchingResult(userSolution: Seq[T]): MatchingResult[T, E] = MatchingResult(Seq.empty, Seq.empty, userSolution)

  protected def findAndRemove(xs: List[T], f: T => Boolean): Option[(T, List[T])] = {
    @scala.annotation.tailrec
    def go(remaining: List[T], prior: List[T]): Option[(T, List[T])] = remaining match {
      case Nil          => None
      case head :: tail => if (f(head)) Some((head, prior ++ tail)) else go(tail, prior :+ head)
    }

    go(xs, List.empty)
  }

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T, E]

}
