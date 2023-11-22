package model.matching

import org.scalatest.flatspec.AnyFlatSpecLike
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor2}

import scala.language.implicitConversions

trait MatcherTest[T, E <: MatchExplanation] extends AnyFlatSpecLike with Matchers with TableDrivenPropertyChecks:

  given Conversion[(T, T), Match[T, E]] = (t1, t2) => Match(t1, t2, None)

  given Conversion[((T, T), E), Match[T, E]] = (ts, e) => Match(ts._1, ts._2, Some(e))

  // protected implicit def tuple2Match(t: (T, T)): Match[T, E] = Match(t._1, t._2, None)

  // protected implicit def triple2Match(t: ((T, T), E)): Match[T, E] = Match(t._1._1, t._1._2, Some(t._2))

  protected val testData: TableFor2[(Seq[T], Seq[T]), MatchingResult[T, E]]
