package model.matching.paragraphMatching

import model.ParagraphCitation
import model.matching.{Match, MatcherTest, MatchingResult}

import scala.language.implicitConversions

class ParagraphMatcherTest extends MatcherTest[ParagraphCitation, ParagraphCitationMatchExplanation] with ParagraphTestHelpers:

  behavior of "ParagraphMatcher"

  override val testData = Table(
    ("sampleValues", "userValues", "awaitedMatchingResult"),
    (
      Seq("GG" paragraph 1),
      Seq("GG" paragraph 1),
      MatchingResult(
        matches = Seq(
          Match("GG" paragraph 1, "GG" paragraph 1)
        )
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2),
      Seq("GG" paragraph 2, "GG" paragraph 1),
      MatchingResult(
        matches = Seq(
          Match("GG" paragraph 1, "GG" paragraph 1),
          Match("GG" paragraph 2, "GG" paragraph 2)
        )
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2, "GG" paragraph 3),
      Seq("GG" paragraph 2, "GG" paragraph 1, "GG" paragraph 4),
      MatchingResult(
        matches = Seq(
          Match("GG" paragraph 1, "GG" paragraph 1),
          Match("GG" paragraph 2, "GG" paragraph 2)
        ),
        notMatchedSample = Seq("GG" paragraph 3),
        notMatchedUser = Seq("GG" paragraph 4)
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2, "VwGO" paragraph 2, "POG" article 4),
      Seq("VwGO" paragraph 2, "GG" paragraph 1, "GG" paragraph 2, "GG" paragraph 4, "PAG" article 4),
      MatchingResult(
        matches = Seq(
          Match("GG" paragraph 1, "GG" paragraph 1),
          Match("GG" paragraph 2, "GG" paragraph 2),
          Match("VwGO" paragraph 2, "VwGO" paragraph 2)
        ),
        notMatchedSample = Seq("POG" article 4),
        notMatchedUser = Seq("GG" paragraph 4, "PAG" article 4)
      )
    )
  )

  it should "match paragraphs" in forAll(testData) { case (sampleValues, userValues, awaitedMatchingResult) =>
    ParagraphMatcher.performMatching(sampleValues, userValues) shouldEqual awaitedMatchingResult
  }
