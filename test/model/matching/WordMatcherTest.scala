package model.matching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

import scala.language.implicitConversions

// TODO: more test data!
class WordMatcherTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "WordMatcher"

  private implicit def tuple2ExtractedWord(t: (Int, String)): ExtractedWord = ExtractedWord(t._1, t._2)

  // Updates...

  private val cases: Seq[(String, Seq[ExtractedWord])] = Seq(
    "Keine Sonderzuweisung"        -> Seq(0 -> "keine", 1 -> "sonderzuweisung"),
    "Aufdrängende Sonderzuweisung" -> Seq(0 -> "aufdrängende", 1 -> "sonderzuweisung"),
    "Trotz irreführendem Wortlaut nichtverfassungsrechtlicher Art" -> Seq(
      0 -> "trotz",
      1 -> "irreführendem",
      2 -> "wortlaut",
      3 -> "nichtverfassungsrechtlicher",
      4 -> "art"
    ),
    "Nichtverfassungsrechtlicher Art" -> Seq(0 -> "nichtverfassungsrechtlicher", 1 -> "art")
  )

  it should "extract new words" in cases.foreach { case (text, awaited) =>
    WordMatcher.extractWordsNew(text) shouldEqual awaited
  }

  it should "match extracted words" in forAll(
    Table[Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int])](
      ("left", "right", "awaited"),
      (0, 1, (Seq(1 -> 1), Seq(0), Seq(0))),
      (2, 3, (Seq(3 -> 0, 4 -> 1), Seq(0, 1, 2), Seq.empty))
    )
  ) { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = cases(leftIndex)._2
    val right = cases(rightIndex)._2

    val awaited = MatchingResult[ExtractedWord, Unit](
      matches = matchIndexes.map { case (l, r) => Match(left(l), right(r), None) },
      notMatchedSample = notMatchedSampleIndexes.map { x => left(x) },
      notMatchedUser = notMatchedUserIndexes.map { x => right(x) }
    )

    WordMatcher.performMatching(left, right) shouldEqual awaited
  }

}
