package de.uniwue.ls6.corasModel.levenshtein

import scala.math.min

object Levenshtein {

  private def minimum(i1: Int, i2: Int, i3: Int): Int = min(min(i1, i2), i3)

  def calculate(s1: String, s2: String): LevenshteinResult = {

    val dist = Array.tabulate(s2.length + 1, s1.length + 1) { (j, i) =>
      if (j == 0) i else if (i == 0) j else 0
    }

    for (j <- 1 to s2.length; i <- 1 to s1.length; c1 = s1(i - 1); c2 = s2(j - 1)) {
      dist(j)(i) = if (c1 == c2) {
        dist(j - 1)(i - 1)
      } else {
        minimum(
          dist(j - 1)(i) + 1,
          dist(j)(i - 1) + 1,
          dist(j - 1)(i - 1) + 1
        )
      }
    }

    LevenshteinResult(s1, s2, dist)
  }

  def agreement(s1: String, s2: String): Int = ???

  def distance(s1: String, s2: String): Int = calculate(s1, s2).distance

}
