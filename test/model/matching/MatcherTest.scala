package model.matching

import model.matching.{Match, MatchExplanation, MatchingResult}
import org.scalatest.prop.TableFor2

import scala.language.implicitConversions

trait MatcherTest[T, E <: MatchExplanation] {

  protected implicit def tuple2Match(t: (T, T)): Match[T, E] = Match(t._1, t._2, None)

  protected implicit def triple2Match(t: ((T, T), E)): Match[T, E] = Match(t._1._1, t._1._2, Some(t._2))

  protected val testData: TableFor2[(Seq[T], Seq[T]), MatchingResult[T, E]]

}
