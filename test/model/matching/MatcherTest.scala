package model.matching

import org.scalatest.flatspec.AnyFlatSpecLike
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor3}

import scala.language.implicitConversions

trait MatcherTest[T, E <: MatchExplanation] extends AnyFlatSpecLike with Matchers with TableDrivenPropertyChecks:

  given Conversion[(T, T), Match[T, E]] = (t1, t2) => Match(t1, t2, None)

  given Conversion[((T, T), E), Match[T, E]] = (ts, e) => Match(ts._1, ts._2, Some(e))

  protected val testData: TableFor3[Seq[T], Seq[T], MatchingResult[T, E]]
