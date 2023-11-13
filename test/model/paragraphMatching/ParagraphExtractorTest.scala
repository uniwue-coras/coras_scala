package model.paragraphMatching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class ParagraphExtractorTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "ParagraphExtractor"

  private val extractionData = Table[String, ParagraphCitationLocation](
    // TODO: broken  tests...
    "input" -> "awaited",
    // BGB
    "§ 1 II S. 1, III 4 Nr. 1 BGB"       -> ParagraphCitationLocation(0, 28, "§", "BGB", 1 -> "Abs. 2 S. 1", 1 -> "Abs. 3 S. 4 Nr. 1"),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB" -> ParagraphCitationLocation(0, 34, "§", "BGB", 1 -> "Abs. 2 S. 1 Nr. 2", 1 -> "Abs. 3 Nr. 1 S. 1", 2 -> ""),
    // HGB
    "§ 1 II S. 1, III 4 Nr. 1 HGB"       -> ParagraphCitationLocation(0, 28, "§", "HGB", 1 -> "Abs. 2 S. 1", 1 -> "Abs. 3 S. 4 Nr. 1"),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB" -> ParagraphCitationLocation(0, 34, "§", "HGB", 1 -> "Abs. 2 S. 1 Nr. 2", 1 -> "Abs. 3 Nr. 1 S. 1", 2 -> ""),
    // LABV
    "Art. 2a IIb 2 Nr. 1c LABV" -> ParagraphCitationLocation(0, 25, "Art.", "LABV", 2 -> "a Abs. 2b S. 2 Nr. 1c"),
    "Art. 11 I, II LABV"        -> ParagraphCitationLocation(0, 18, "Art.", "LABV", 11 -> "Abs. 1", 11 -> "Abs. 2"),
    // GG
    "Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG" -> ParagraphCitationLocation(0, 35, "Art.", "GG", 12 -> "Abs. 2 S. 1", 12 -> "Abs. 3 S. 2"),
    // "Art. 12 Abs. 1, 2 Nr. 1, 2 GG"       -> ParagraphCitation(0, 29, "Art.", "GG", "12" -> Seq("Abs. 1", "Abs. 2 Nr. 1, 2")),
    "Art. 12 II 1, III 2 GG" -> ParagraphCitationLocation(0, 22, "Art.", "GG", 12 -> "Abs. 2 S. 1", 12 -> "Abs. 3 S. 2"),
    // "Art. 12 II 1, 2 GG"                  -> ParagraphCitation(0, 18, "Art.", "GG", "12" -> Seq("Abs. 2 1, 2")),
    // "Art. 12 II 1, 2, III 2 Nr. 1 GG"     -> ParagraphCitation(0, 31, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1, S. 2", "Abs. 3 S. 2 Nr. 1")),
    // PAG
    "Art. 2a IIb 2 Nr. 1c PAG" -> ParagraphCitationLocation(0, 24, "Art.", "PAG", 2 -> "a Abs. 2b S. 2 Nr. 1c"),
    "Art. 11 I, II PAG"        -> ParagraphCitationLocation(0, 17, "Art.", "PAG", 11 -> "Abs. 1", 11 -> "Abs. 2"),
    // POG
    "Art. 2a IIb 2 Nr. 1c POG" -> ParagraphCitationLocation(0, 24, "Art.", "POG", 2 -> "a Abs. 2b S. 2 Nr. 1c"),
    "Art. 11 I, II POG"        -> ParagraphCitationLocation(0, 17, "Art.", "POG", 11 -> "Abs. 1", 11 -> "Abs. 2"),
    // AGVwGO
    "§ 1, 2 AGVwGO" -> ParagraphCitationLocation(0, 13, "§", "AGVwGO", 1 -> "", 2 -> ""),
    // VwGO
    "§ 1, 2 VwGO" -> ParagraphCitationLocation(0, 11, "§", "VwGO", 1 -> "", 2 -> "")
  )

  it should "extract paragraphs" in forAll(extractionData) { case (text, extracted) =>
    model.paragraphMatching.ParagraphExtractor.extract(text) shouldEqual Seq(extracted)
  }

  private val processRestData = Table[String, Seq[ParagraphCitationLocation.CitedParag]](
    "rest"                   -> "awaited",
    "49"                     -> Seq(49 -> ""),
    "61 ff."                 -> Seq(61 -> "ff."),
    "49 IV"                  -> Seq(49 -> "Abs. 4"),
    "43 I"                   -> Seq(43 -> "Abs. 1"),
    "42 II"                  -> Seq(42 -> "Abs. 2"),
    "62 III"                 -> Seq(62 -> "Abs. 3"),
    "40 I 1"                 -> Seq(40 -> "Abs. 1 S. 1"),
    "38 I S. 1"              -> Seq(38 -> "Abs. 1 S. 1"),
    "49 I 1"                 -> Seq(49 -> "Abs. 1 S. 1"),
    "35 S. 1"                -> Seq(35 -> "S. 1"),
    "51 I 2"                 -> Seq(51 -> "Abs. 1 S. 2"),
    "42 I Var. 1"            -> Seq(42 -> "Abs. 1 Var. 1"),
    "61 Nr. 2"               -> Seq(61 -> "Nr. 2"),
    "62 I Nr. 1"             -> Seq(62 -> "Abs. 1 Nr. 1"),
    "61 Nr. 1 Alt. 2"        -> Seq(61 -> "Nr. 1 Alt. 2"),
    "61 Nr. 1 Alt. 2"        -> Seq(61 -> "Nr. 1 Alt. 2"),
    "43 II, 113 IV"          -> Seq(43 -> "Abs. 2", 113 -> "Abs. 4"),
    "61 Nr. 1 Alt. 1, Nr. 2" -> Seq(61 -> "Nr. 1 Alt. 1", 61 -> "Nr. 2"),
    "88, 86 I, III"          -> Seq(86 -> "Abs. 1", 86 -> "Abs. 3", 88 -> "")
  )

  it should "process the rest" in forAll(processRestData) { case (rest, processed) =>
    model.paragraphMatching.ParagraphExtractor.processRest(rest) shouldEqual processed
  }

  private val paragraphExtractionData = Table[String, (String, Seq[ParagraphCitationLocation])](
    "heading"                          -> "awaitedParagraphCitation",
    "Sachentscheidungsvoraussetzungen" -> ("Sachentscheidungsvoraussetzungen", Seq.empty),
    "Generalklausel § 40 I 1 VwGO" -> ("Generalklausel", Seq(
      ParagraphCitationLocation(15, 28, "§", "VwGO", 40 -> "Abs. 1 S. 1")
    )),
    // TODO: try to remove strange artifacts?
    "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO" -> ("Beteiligtenfähig: K,  ,", Seq(
      ParagraphCitationLocation(21, 43, "§", "VwGO", 61 -> "Nr. 1 Alt. 2"),
      ParagraphCitationLocation(45, 54, "Art.", "GO", 1 -> "")
    )),
    "Prozessfähig: § 62 III VwGO, Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO" -> ("Prozessfähig:  ,", Seq(
      // § 62 III VwGO",
      ParagraphCitationLocation(14, 27, "§", "VwGO", 62 -> "Abs. 3"),
      // Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO
      ParagraphCitationLocation(29, 67, "Art.", "GO", 29 -> "", 34 -> "Abs. 1 S. 2", 37 -> "Abs. 1 S. 1 Nr. 1", 38 -> "Abs. 1")
    ))
  )

  it should "extract and replace paragraph mentions in headings" in forAll(paragraphExtractionData) { (heading, awaitedParagraphCitation) =>
    model.paragraphMatching.ParagraphExtractor.extractAndReplace(heading) shouldEqual awaitedParagraphCitation
  }

}
