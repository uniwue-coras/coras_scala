package model.paragraphMatching

import model.matching.{MatcherTest, MatchingResult}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class ParagraphMatcherTest
    extends AnyFlatSpec
    with Matchers
    with TableDrivenPropertyChecks
    with MatcherTest[ParagraphCitation, ParagraphCitationMatchExplanation] {

  behavior of "ParagraphMatcher"

  private def gg(paragraphNumber: Int, rest: String = ""): ParagraphCitation   = ParagraphCitation("§", "GG", paragraphNumber, rest)
  private def vwgo(paragraphNumber: Int, rest: String = ""): ParagraphCitation = ParagraphCitation("§", "VwGO", paragraphNumber, rest)
  private def pog(paragraphNumber: Int, rest: String = ""): ParagraphCitation  = ParagraphCitation("Art.", "POG", paragraphNumber, rest)
  private def pag(paragraphNumber: Int, rest: String = ""): ParagraphCitation  = ParagraphCitation("Art.", "PAG", paragraphNumber, rest)

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
