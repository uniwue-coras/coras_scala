package model.correction

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

// TODO: more test data!
class NounMatcherTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "NounMatcher"

  private val cases = Seq(
    "Keine Sonderzuweisung"        -> Seq(ExtractedNoun(0, 5, "Keine"), ExtractedNoun(6, 21, "Sonderzuweisung")),
    "Aufdrängende Sonderzuweisung" -> Seq(ExtractedNoun(0, 12, "Aufdrängende"), ExtractedNoun(13, 28, "Sonderzuweisung"))
  )

  it should "extract nouns with their positions" in cases.foreach { case (text, awaited) =>
    NounMatcher.newExtractNouns(text) shouldEqual awaited
  }

  it should "match extracted nouns" in forAll(
    Table[Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int])](
      ("left", "right", "awaited"),
      (0, 1, (Seq(1 -> 1), Seq(0), Seq(0)))
    )
  ) { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = cases(leftIndex)._2
    val right = cases(rightIndex)._2

    val awaited = MatchingResult[ExtractedNoun, Unit](
      matches = matchIndexes.map { case (leftIndex, rightIndex) => Match(left(leftIndex), right(rightIndex), None) },
      notMatchedSample = notMatchedSampleIndexes.map { x => left(x) },
      notMatchedUser = notMatchedUserIndexes.map { x => right(x) }
    )

    NounMatcher.performMatching(left, right) shouldEqual awaited
  }

}
