package model.matching

import munit.FunSuite

import scala.language.implicitConversions

trait MatcherTest[T, E <: MatchExplanation] extends FunSuite:

  given Conversion[(T, T), Match[T, E]] = (t1, t2) => Match(t1, t2, None)

  given Conversion[((T, T), E), Match[T, E]] = (ts, e) => Match(ts._1, ts._2, Some(e))

  protected val testData: Seq[(Seq[T], Seq[T], MatchingResult[T, E])]
