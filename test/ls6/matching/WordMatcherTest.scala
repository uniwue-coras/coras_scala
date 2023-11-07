package ls6.matching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import model.ls6.matching.{WordMatcher, WordWithRelatedWords, Match, MatchingResult}

class WordMatcherTest extends AnyFlatSpec with Matchers {

  behavior of "WordMatcher"

  // Updates...

  private val data: Seq[(String, Seq[String])] = Seq(
    "Keine Sonderzuweisung" -> Seq("keine", "sonderzuweisung"),
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

  private val cases = Seq[(Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int]))](
    (0, 1, (Seq(1 -> 1), Seq(0), Seq(0))),
    (2, 3, (Seq(3 -> 0, 4 -> 1), Seq(0, 1, 2), Seq.empty))
  )

  it should "match extracted words" in cases.foreach { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = data(leftIndex)._2
    val right = data(rightIndex)._2

    val awaited = MatchingResult[WordWithRelatedWords, Unit](
      matches = matchIndexes.map { case (l, r) => Match(WordWithRelatedWords(left(l)), WordWithRelatedWords(right(r)), None) },
      notMatchedSample = notMatchedSampleIndexes.map { x => WordWithRelatedWords(left(x)) },
      notMatchedUser = notMatchedUserIndexes.map { x => WordWithRelatedWords(right(x)) }
    )

    val result = WordMatcher.performMatching(
      left.map(WordWithRelatedWords(_)),
      right.map(WordWithRelatedWords(_))
    )

    result shouldEqual awaited
  }

}
