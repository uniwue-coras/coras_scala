package model.levenshtein

import model.levenshtein.Levenshtein.{calculate => levenshtein}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor4}

import scala.language.implicitConversions

class LevenshteinTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  private implicit def charTupleToReplacement(chars: (Char, Char)): Replacement = Replacement(chars._1, chars._2)

  behavior of "Levenshtein"

  val cases: TableFor4[String, String, Int, Seq[Operation]] = Table(
    ("s1", "s2", "distance", "operations"),
    ("otto", "otto", 0, Seq(NoOp, NoOp, NoOp, NoOp)),
    ("tor", "tier", 2, Seq(NoOp, Deletion('i'), 'e' -> 'o', NoOp)),
    ("m", "max", 2, Seq(NoOp, Deletion('a'), Deletion('x'))),
    ("max", "man", 1, Seq(NoOp, NoOp, 'n' -> 'x')),
    ("max", "min", 2, Seq(NoOp, 'i' -> 'a', 'n' -> 'x')),
    ("democrat", "republican", 8, Seq('r' -> 'd', NoOp, Deletion('p'), Deletion('u'), 'b' -> 'm', 'l' -> 'o', 'i' -> 'c', 'c' -> 'r', NoOp, 'n' -> 't'))
  )

  it should "should calculate correct distances and operations" in forAll(cases) { case (s1, s2, distance, operations) =>
    val result = levenshtein(s1, s2)

    result.distance shouldBe distance

    result.operations shouldBe operations
  }

}
