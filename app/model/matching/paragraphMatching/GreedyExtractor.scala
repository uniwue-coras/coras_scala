package model.matching.paragraphMatching

import scala.annotation.tailrec

trait GreedyExtractor[+T] extends (String => Option[(T, Int)]) {

  type Res[T] = (T, Int)

  def ^^[U](f: T => U): GreedyExtractor[U] = source => this.apply(source).map { case (value, offset) => (f(value), offset) }

  def ~[U](that: => GreedyExtractor[U]): GreedyExtractor[(T, U)] = source =>
    for {
      (thisResult, thisOffset) <- this.apply(source)
      (thatResult, thatOffset) <- that.apply(source.substring(thisOffset))
    } yield ((thisResult, thatResult), thisOffset + thatOffset)

  def <~[U](that: => GreedyExtractor[U]): GreedyExtractor[U] = (this ~ that) ^^ { _._2 }

  def * : GreedyExtractor[Seq[T]] = source => {
    @scala.annotation.tailrec
    def go(acc: Seq[T], offset: Int): Option[Res[Seq[T]]] = this.apply(source.substring(offset)) match {
      case None                               => Some((acc, offset))
      case Some((extracted, extractedLength)) => go(acc :+ extracted, offset + extractedLength)
    }

    go(Seq.empty, 0)
  }

  def ? : GreedyExtractor[Option[T]] = source =>
    this.apply(source) match {
      case None                  => Some((None, 0))
      case Some((value, offset)) => Some((Some(value), offset))
    }

  def sepBy1[U](that: => GreedyExtractor[U]): GreedyExtractor[Seq[T]] = this ~ (that <~ this).* ^^ { case (first, others) => first +: others }

  def tapResult(f: T => Unit) = this ^^ { t =>
    f(t); t
  }
}

object GreedyExtractor {
  def or[T](extractors: GreedyExtractor[T]*): GreedyExtractor[T] = source => {

    @tailrec
    def go(extrs: List[GreedyExtractor[T]]): Option[(T, Int)] = extrs match {
      case Nil => None
      case head :: tail =>
        head.apply(source) match {
          case Some(value) => Some(value)
          case None        => go(tail)
        }
    }

    go(extractors.toList)
  }
}
