package model.matching.paragraphMatching

import model.matching.{CertainMatch, CertainMatcherTest, CertainMatchingResult}

import scala.language.implicitConversions

class ParagraphMatcherTest extends CertainMatcherTest[ParagraphCitation] with ParagraphTestHelpers:

  behavior of "ParagraphMatcher"

  override protected val matcherUnderTest = ParagraphMatcher

  override val testData = Table(
    ("sampleValues", "userValues", "awaitedMatchingResult"),
    (
      Seq("GG" paragraph 1),
      Seq("GG" paragraph 1),
      CertainMatchingResult(
        matches = Seq(
          CertainMatch("GG" paragraph 1, "GG" paragraph 1)
        )
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2),
      Seq("GG" paragraph 2, "GG" paragraph 1),
      CertainMatchingResult(
        matches = Seq(
          CertainMatch("GG" paragraph 1, "GG" paragraph 1),
          CertainMatch("GG" paragraph 2, "GG" paragraph 2)
        )
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2, "GG" paragraph 3),
      Seq("GG" paragraph 2, "GG" paragraph 1, "GG" paragraph 4),
      CertainMatchingResult(
        matches = Seq(
          CertainMatch("GG" paragraph 1, "GG" paragraph 1),
          CertainMatch("GG" paragraph 2, "GG" paragraph 2)
        ),
        notMatchedSample = Seq("GG" paragraph 3),
        notMatchedUser = Seq("GG" paragraph 4)
      )
    ),
    (
      Seq("GG" paragraph 1, "GG" paragraph 2, "VwGO" paragraph 2, "POG" article 4),
      Seq("VwGO" paragraph 2, "GG" paragraph 1, "GG" paragraph 2, "GG" paragraph 4, "PAG" article 4),
      CertainMatchingResult(
        matches = Seq(
          CertainMatch("GG" paragraph 1, "GG" paragraph 1),
          CertainMatch("GG" paragraph 2, "GG" paragraph 2),
          CertainMatch("VwGO" paragraph 2, "VwGO" paragraph 2)
        ),
        notMatchedSample = Seq("POG" article 4),
        notMatchedUser = Seq("GG" paragraph 4, "PAG" article 4)
      )
    )
  )

  it should "match paragraphs" in forAll(testData) { case (sampleValues, userValues, awaitedMatchingResult) =>
    matcherUnderTest.performCertainMatching(sampleValues, userValues) shouldEqual awaitedMatchingResult
  }
