package model.matching.wordMatching

import model.matching.{Match, MatchingResult}
import munit.FunSuite

class WordMatcherTest extends FunSuite {

  // Updates...

  private val data: Seq[(String, Seq[String])] = Seq(
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

  private val cases = Seq[(Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int]))](
    (0, 1, (Seq(1 -> 1), Seq(0), Seq(0))),
    (2, 3, (Seq(3 -> 0, 4 -> 1), Seq(0, 1, 2), Seq.empty))
  )

  test("it should match extracted words") {
    for {
      (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) <- cases

      left  = data(leftIndex)._2
      right = data(rightIndex)._2

      awaited = MatchingResult[WordWithRelatedWords, WordMatchExplanation](
        matches = matchIndexes.map { case (l, r) => Match(WordWithRelatedWords(left(l)), WordWithRelatedWords(right(r)), None) },
        notMatchedSample = notMatchedSampleIndexes.map { x => WordWithRelatedWords(left(x)) },
        notMatchedUser = notMatchedUserIndexes.map { x => WordWithRelatedWords(right(x)) }
      )

      result = WordMatcher.performMatching(
        left.map(WordWithRelatedWords(_)),
        right.map(WordWithRelatedWords(_))
      )

    } yield assertEquals(result, awaited)
  }
}
