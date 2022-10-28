package model.levenshtein

import model.levenshtein.Levenshtein.{calculate => levenshtein}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor4}

class LevenshteinTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "Levenshtein"

  val cases: TableFor4[String, String, Int, Seq[Operation]] = Table(
    ("s1", "s2", "distance", "operations"),
    ("otto", "otto", 0, Seq(NoOp, NoOp, NoOp, NoOp)),
    ("tor", "tier", 2, Seq(NoOp, Deletion('i'), Replacement('e', 'o'), NoOp)),
    ("m", "max", 2, Seq(NoOp, Deletion('a'), Deletion('x'))),
    ("max", "man", 1, Seq(NoOp, NoOp, Replacement('n', 'x'))),
    ("max", "min", 2, Seq(NoOp, Replacement('i', 'a'), Replacement('n', 'x')))
    // ("democrat", "republican", 8, Seq(Deletion, Deletion, Replacement, NoOp, Replacement, Replacement, Replacement, Replacement, NoOp, Replacement))
  )

  it should "should calculate correct distances and operations" in forAll(cases) { case (s1, s2, distance, operations) =>
    val result = levenshtein(s1, s2)

    result.distance shouldBe distance

    result.operations shouldBe operations
  }

}
