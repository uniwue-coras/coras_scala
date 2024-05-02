package model.matching.paragraphMatching

import model.ParagraphCitation
import model.matching.{Match, MatcherTest, MatchingResult}

import scala.language.implicitConversions

class ParagraphMatcherTest extends MatcherTest[ParagraphCitation, ParagraphCitationMatchExplanation] with ParagraphTestHelpers{

  private val gg1 = "GG" paragraph "1"
  private val gg2 = "GG" paragraph "2"
  private val gg3 = "GG" paragraph "3"
  private val gg4 = "GG" paragraph "4"

  private val vwgo2 = "VwGO" paragraph "2"

  extension (pt: (ParagraphCitation, ParagraphCitation)) def aMatch: Match[ParagraphCitation, ParagraphCitationMatchExplanation] = Match(pt._1, pt._2, None)

  override val testData = Seq(
    (
      Seq(gg1),
      Seq(gg1),
      MatchingResult(
        matches = Seq(gg1 -> gg1)
      )
    ),
    (
      Seq(gg1, gg2),
      Seq(gg2, gg1),
      MatchingResult(
        matches = Seq(gg1 -> gg1, gg2 -> gg2)
      )
    ),
    (
      Seq(gg1, gg2, gg3),
      Seq(gg2, gg1, gg4),
      MatchingResult(
        matches = Seq(gg1 -> gg1, gg2 -> gg2),
        notMatchedSample = Seq(gg3),
        notMatchedUser = Seq(gg4)
      )
    ),
    (
      Seq(gg1, gg2, vwgo2, "POG" article "4"),
      Seq(vwgo2, gg1, gg2, gg4, "PAG" article "4"),
      MatchingResult(
        matches = Seq(gg1 -> gg1, gg2 -> gg2, vwgo2 -> vwgo2),
        notMatchedSample = Seq("POG" article "4"),
        notMatchedUser = Seq(gg4, "PAG" article "4")
      )
    )
  )

  test("it should match paragraphs") {
    for {
      (sampleValues, userValues, awaitedMatchingResult) <- testData
    } yield assertEquals(ParagraphMatcher.performMatching(sampleValues, userValues), awaitedMatchingResult)
  }
}
