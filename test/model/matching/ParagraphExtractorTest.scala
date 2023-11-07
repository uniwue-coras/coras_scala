package model.matching

import model.matching.{ParagraphCitation, ParagraphExtractor}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class ParagraphExtractorTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "ParagraphExtractor"

  private val extractionData = Table(
    // TODO: broken  tests...
    "input" -> "awaited",
    // BGB
    "§ 1 II S. 1, III 4 Nr. 1 BGB"       -> ParagraphCitation(0, 28, "§", "BGB", "1" -> Seq("Abs. 2 S. 1", "Abs. 3 S. 4 Nr. 1")),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB" -> ParagraphCitation(0, 34, "§", "BGB", "1" -> Seq("Abs. 2 S. 1 Nr. 2", "Abs. 3 Nr. 1 S. 1"), "2" -> Seq("")),
    // HGB
    "§ 1 II S. 1, III 4 Nr. 1 HGB"       -> ParagraphCitation(0, 28, "§", "HGB", "1" -> Seq("Abs. 2 S. 1", "Abs. 3 S. 4 Nr. 1")),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB" -> ParagraphCitation(0, 34, "§", "HGB", "1" -> Seq("Abs. 2 S. 1 Nr. 2", "Abs. 3 Nr. 1 S. 1"), "2" -> Seq("")),
    // LABV
    "Art. 2a IIb 2 Nr. 1c LABV" -> ParagraphCitation(0, 25, "Art.", "LABV", "2" -> Seq("a Abs. 2b S. 2 Nr. 1c")),
    "Art. 11 I, II LABV"        -> ParagraphCitation(0, 18, "Art.", "LABV", "11" -> Seq("Abs. 1", "Abs. 2")),
    // GG
    "Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG" -> ParagraphCitation(0, 35, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1", "Abs. 3 S. 2")),
    // "Art. 12 Abs. 1, 2 Nr. 1, 2 GG"       -> ParagraphCitation(0, 29, "Art.", "GG", "12" -> Seq("Abs. 1", "Abs. 2 Nr. 1, 2")),
    "Art. 12 II 1, III 2 GG" -> ParagraphCitation(0, 22, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1", "Abs. 3 S. 2")),
    // "Art. 12 II 1, 2 GG"                  -> ParagraphCitation(0, 18, "Art.", "GG", "12" -> Seq("Abs. 2 1, 2")),
    // "Art. 12 II 1, 2, III 2 Nr. 1 GG"     -> ParagraphCitation(0, 31, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1, S. 2", "Abs. 3 S. 2 Nr. 1")),
    // PAG
    "Art. 2a IIb 2 Nr. 1c PAG" -> ParagraphCitation(0, 24, "Art.", "PAG", "2" -> Seq("a Abs. 2b S. 2 Nr. 1c")),
    "Art. 11 I, II PAG"        -> ParagraphCitation(0, 17, "Art.", "PAG", "11" -> Seq("Abs. 1", "Abs. 2")),
    // POG
    "Art. 2a IIb 2 Nr. 1c POG" -> ParagraphCitation(0, 24, "Art.", "POG", "2" -> Seq("a Abs. 2b S. 2 Nr. 1c")),
    "Art. 11 I, II POG"        -> ParagraphCitation(0, 17, "Art.", "POG", "11" -> Seq("Abs. 1", "Abs. 2")),
    // AGVwGO
    "§ 1, 2 AGVwGO" -> ParagraphCitation(0, 13, "§", "AGVwGO", "1" -> Seq(""), "2" -> Seq("")),
    // VwGO
    "§ 1, 2 VwGO" -> ParagraphCitation(0, 11, "§", "VwGO", "1" -> Seq(""), "2" -> Seq(""))
  )

  it should "extract paragraphs" in forAll(extractionData) { case (text, extracted) =>
    ParagraphExtractor.extract(text) shouldEqual Seq(extracted)
  }

  private val processRestData = Table[String, Map[String, Seq[String]]](
    "rest"                   -> "awaited",
    "49"                     -> Map("49" -> Seq("")),
    "61 ff."                 -> Map("61" -> Seq("ff.")),
    "49 IV"                  -> Map("49" -> Seq("Abs. 4")),
    "43 I"                   -> Map("43" -> Seq("Abs. 1")),
    "42 II"                  -> Map("42" -> Seq("Abs. 2")),
    "62 III"                 -> Map("62" -> Seq("Abs. 3")),
    "40 I 1"                 -> Map("40" -> Seq("Abs. 1 S. 1")),
    "38 I S. 1"              -> Map("38" -> Seq("Abs. 1 S. 1")),
    "49 I 1"                 -> Map("49" -> Seq("Abs. 1 S. 1")),
    "35 S. 1"                -> Map("35" -> Seq("S. 1")),
    "51 I 2"                 -> Map("51" -> Seq("Abs. 1 S. 2")),
    "42 I Var. 1"            -> Map("42" -> Seq("Abs. 1 Var. 1")),
    "61 Nr. 2"               -> Map("61" -> Seq("Nr. 2")),
    "62 I Nr. 1"             -> Map("62" -> Seq("Abs. 1 Nr. 1")),
    "61 Nr. 1 Alt. 2"        -> Map("61" -> Seq("Nr. 1 Alt. 2")),
    "61 Nr. 1 Alt. 2"        -> Map("61" -> Seq("Nr. 1 Alt. 2")),
    "43 II, 113 IV"          -> Map("43" -> Seq("Abs. 2"), "113" -> Seq("Abs. 4")),
    "61 Nr. 1 Alt. 1, Nr. 2" -> Map("61" -> Seq("Nr. 1 Alt. 1", "Nr. 2")),
    "88, 86 I, III"          -> Map("88" -> Seq(""), "86" -> Seq("Abs. 1", "Abs. 3"))
  )

  it should "process the rest" in forAll(processRestData) { case (rest, processed) =>
    ParagraphExtractor.processRest(rest) shouldEqual processed
  }

  private val paragraphExtractionData = Table(
    "heading"                          -> "awaitedParagraphCitation",
    "Sachentscheidungsvoraussetzungen" -> ("Sachentscheidungsvoraussetzungen", Seq.empty),
    "Generalklausel § 40 I 1 VwGO" -> ("Generalklausel", Seq(
      ParagraphCitation(15, 28, "§", "VwGO", "40" -> Seq("Abs. 1 S. 1"))
    )),
    // TODO: try to remove strange artifacts?
    "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO" -> ("Beteiligtenfähig: K,  ,", Seq(
      ParagraphCitation(21, 43, "§", "VwGO", "61" -> Seq("Nr. 1 Alt. 2")),
      ParagraphCitation(45, 54, "Art.", "GO", "1" -> Seq(""))
    )),
    "Prozessfähig: § 62 III VwGO, Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO" -> ("Prozessfähig:  ,", Seq(
      // § 62 III VwGO",
      ParagraphCitation(14, 27, "§", "VwGO", "62" -> Seq("Abs. 3")),
      // Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO
      ParagraphCitation(29, 67, "Art.", "GO", "34" -> Seq("Abs. 1 S. 2"), "37" -> Seq("Abs. 1 S. 1 Nr. 1"), "38" -> Seq("Abs. 1"), "29" -> Seq(""))
    ))
  )

  it should "extract and replace paragraph mentions in headings" in forAll(paragraphExtractionData) { (heading, awaitedParagraphCitation) =>
    ParagraphExtractor.extractAndReplace(heading) shouldEqual awaitedParagraphCitation
  }

}
