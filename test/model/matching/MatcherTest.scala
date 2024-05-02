package model.matching

import munit.FunSuite

import scala.language.implicitConversions

trait MatcherTest[T, E <: MatchExplanation] extends FunSuite {

  implicit def tuple2Match(t: (T, T)): Match[T, E] = Match(t._1, t._2, None)

  implicit def triple2Match(t: ((T, T), E)): Match[T, E] = Match(t._1._1, t._1._2, Some(t._2))

  protected val testData: Seq[(Seq[T], Seq[T], MatchingResult[T, E])]

}
