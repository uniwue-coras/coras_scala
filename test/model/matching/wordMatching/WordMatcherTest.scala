package model.matching.wordMatching

import model.matching.{CertainMatch, CompleteMatchingResult}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class WordMatcherTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks:

  behavior of "WordMatcher"

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

  private val cases = Table[Int, Int, (Seq[(Int, Int)], Seq[Int], Seq[Int])](
    ("sampleId", "userId", "resultIds"),
    (0, 1, (Seq(1 -> 1), Seq(0), Seq(0))),
    (2, 3, (Seq(3 -> 0, 4 -> 1), Seq(0, 1, 2), Seq.empty))
  )

  it should "match extracted words" in forAll(cases) { case (leftIndex, rightIndex, (matchIndexes, notMatchedSampleIndexes, notMatchedUserIndexes)) =>
    val left  = data(leftIndex)._2
    val right = data(rightIndex)._2

    val awaited = CompleteMatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation](
      certainMatches = matchIndexes.map { case (l, r) => CertainMatch(WordWithRelatedWords(left(l)), WordWithRelatedWords(right(r))) },
      fuzzyMatches = Seq.empty,
      notMatchedSample = notMatchedSampleIndexes.map { x => WordWithRelatedWords(left(x)) },
      notMatchedUser = notMatchedUserIndexes.map { x => WordWithRelatedWords(right(x)) }
    )

    val result = WordMatcher.performMatching(
      left.map(WordWithRelatedWords(_)),
      right.map(WordWithRelatedWords(_))
    )

    result shouldEqual awaited
  }
