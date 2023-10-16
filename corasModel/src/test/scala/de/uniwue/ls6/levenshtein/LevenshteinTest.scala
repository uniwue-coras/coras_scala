package de.uniwue.ls6.levenshtein

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class LevenshteinTest extends AnyFlatSpec with Matchers {

  behavior of "Levenshtein"

  private val cases: Seq[(String, String, Int)] = Seq(
    ("otto", "otto", 0),
    ("tor", "tier", 2),
    ("m", "max", 2),
    ("max", "man", 1),
    ("max", "min", 2),
    ("democrat", "republican", 8)
  )

  it should "should calculate correct distances" in cases.foreach { case (s1, s2, distance) =>
    Levenshtein.calculate(s1, s2).distance shouldBe distance
  }

}
