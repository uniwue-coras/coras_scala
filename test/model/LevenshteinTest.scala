package model

import munit.FunSuite

class LevenshteinTest extends FunSuite {

  private val cases: Seq[(String, String, Int)] = Seq(
    ("otto", "otto", 0),
    ("tor", "tier", 2),
    ("m", "max", 2),
    ("max", "man", 1),
    ("max", "min", 2),
    ("democrat", "republican", 8)
  )

  test("it should calculate correct distances") {
    for {
      (s1, s2, distance) <- cases
    } yield assertEquals(Levenshtein.distance(s1, s2), distance)
  }
}
