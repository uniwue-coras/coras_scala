package model.correction

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

// TODO: more test data!
class WordMatcherTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "WordMatcher"

  // Updates...

  private val cases = Seq(
    "Keine Sonderzuweisung"        -> Seq(ExtractedWordNew(0, "Keine"), ExtractedWordNew(1, "Sonderzuweisung")),
    "Aufdrängende Sonderzuweisung" -> Seq(ExtractedWordNew(0, "Aufdrängende"), ExtractedWordNew(1, "Sonderzuweisung"))
  )

  it should "extract new words" in cases.foreach { case (text, awaited) =>
    WordMatcher.extractWordsNew(text) shouldEqual awaited
  }

  it should "match extracted words" in forAll(
    Table[Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int])](
      ("left", "right", "awaited"),
      (0, 1, (Seq(1 -> 1), Seq(0), Seq(0)))
    )
  ) { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = cases(leftIndex)._2
    val right = cases(rightIndex)._2

    val awaited = MatchingResult[ExtractedWordNew, Unit](
      matches = matchIndexes.map { case (l, r) => Match(left(l), right(r), None) },
      notMatchedSample = notMatchedSampleIndexes.map { x => left(x) },
      notMatchedUser = notMatchedUserIndexes.map { x => right(x) }
    )

    WordMatcher.performMatching(left, right) shouldEqual awaited
  }

}
