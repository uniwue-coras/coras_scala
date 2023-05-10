package model.matching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class WordMatcherTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "WordMatcher"

  // Updates...

  private val cases: Seq[(String, Seq[String])] = Seq(
    "Keine Sonderzuweisung"        -> Seq("keine", "sonderzuweisung"),
    "Aufdrängende Sonderzuweisung" -> Seq("aufdrängende", "sonderzuweisung"),
    "Trotz irreführendem Wortlaut nichtverfassungsrechtlicher Art" -> Seq(
      "trotz",
      "irreführendem",
      "wortlaut",
      "nichtverfassungsrechtlicher",
      "art"
    ),
    "Nichtverfassungsrechtlicher Art" -> Seq("nichtverfassungsrechtlicher", "art")
  )

  it should "match extracted words" in forAll(
    Table[Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int])](
      ("left", "right", "awaited"),
      (0, 1, (Seq(1 -> 1), Seq(0), Seq(0))),
      (2, 3, (Seq(3 -> 0, 4 -> 1), Seq(0, 1, 2), Seq.empty))
    )
  ) { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = cases(leftIndex)._2
    val right = cases(rightIndex)._2

    val awaited = MatchingResult[String, Unit](
      matches = matchIndexes.map { case (l, r) => Match(left(l), right(r), None) },
      notMatchedSample = notMatchedSampleIndexes.map { x => left(x) },
      notMatchedUser = notMatchedUserIndexes.map { x => right(x) }
    )

    WordMatcher.performMatching(left, right) shouldEqual awaited
  }

}
