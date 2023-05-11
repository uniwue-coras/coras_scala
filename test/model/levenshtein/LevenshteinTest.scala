package model.levenshtein

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.language.implicitConversions

class LevenshteinTest extends AnyFlatSpec with Matchers {

  private implicit def charTupleToReplacement(chars: (Char, Char)): Replacement = Replacement(chars._1, chars._2)

  behavior of "Levenshtein"

  private val cases: Seq[(String, String, Int, Seq[Operation])] = Seq(
    ("otto", "otto", 0, Seq(NoOp, NoOp, NoOp, NoOp)),
    ("tor", "tier", 2, Seq(NoOp, Deletion('i'), 'e' -> 'o', NoOp)),
    ("m", "max", 2, Seq(NoOp, Deletion('a'), Deletion('x'))),
    ("max", "man", 1, Seq(NoOp, NoOp, 'n' -> 'x')),
    ("max", "min", 2, Seq(NoOp, 'i' -> 'a', 'n' -> 'x')),
    ("democrat", "republican", 8, Seq('r' -> 'd', NoOp, Deletion('p'), Deletion('u'), 'b' -> 'm', 'l' -> 'o', 'i' -> 'c', 'c' -> 'r', NoOp, 'n' -> 't'))
  )

  it should "should calculate correct distances and operations" in cases.foreach { case (s1, s2, distance, operations) =>
    val result = Levenshtein.calculate(s1, s2)

    result.distance shouldBe distance

    result.operations shouldBe operations
  }

}
