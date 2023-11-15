package model.paragraphMatching

import model.matching.{MatcherTest, MatchingResult}

trait ParagraphTestHelpers {

  protected def gg(paragraphNumber: Int, rest: String = ""): ParagraphCitation = ParagraphCitation("§", "GG", paragraphNumber, rest)

  protected def vwgo(paragraphNumber: Int, rest: String = ""): ParagraphCitation = ParagraphCitation("§", "VwGO", paragraphNumber, rest)

  protected def pog(paragraphNumber: Int, rest: String = ""): ParagraphCitation = ParagraphCitation("Art.", "POG", paragraphNumber, rest)

  protected def pag(paragraphNumber: Int, rest: String = ""): ParagraphCitation = ParagraphCitation("Art.", "PAG", paragraphNumber, rest)

}

class ParagraphMatcherTest extends MatcherTest[ParagraphCitation, ParagraphCitationMatchExplanation] with ParagraphTestHelpers {

  behavior of "ParagraphMatcher"

  override val testData = Table(
    ("matched", "awaited"),
    (
      Seq(gg(1)) -> Seq(gg(1)) -> MatchingResult(matches = Seq(gg(1) -> gg(1)))
    ),
    (
      Seq(gg(1), gg(2)) -> Seq(gg(2), gg(1)) -> MatchingResult(
        matches = Seq(gg(1) -> gg(1), gg(2) -> gg(2))
      )
    ),
    (
      Seq(gg(1), gg(2), gg(3)) -> Seq(gg(2), gg(1), gg(4)) -> MatchingResult(
        matches = Seq(gg(1) -> gg(1), gg(2) -> gg(2), gg(3) -> gg(4) -> ParagraphCitationMatchExplanation(true, true, false))
      )
    ),
    (
      Seq(gg(1), gg(2), vwgo(2), pog(4)) -> Seq(vwgo(2), gg(1), gg(2), gg(4), pag(4)) -> MatchingResult(
        matches = Seq(gg(1) -> gg(1), gg(2) -> gg(2), vwgo(2) -> vwgo(2), pog(4) -> pag(4) -> ParagraphCitationMatchExplanation(true, false, true)),
        notMatchedUser = Seq(gg(4))
      )
    )
  )

  it should "match paragraphs" in forAll(testData) { case ((samplePars, userPars), awaited) =>
    ParagraphMatcher.performMatching(samplePars, userPars) shouldEqual awaited
  }

}
