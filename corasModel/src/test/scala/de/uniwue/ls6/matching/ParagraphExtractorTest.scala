package de.uniwue.ls6.matching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

class ParagraphExtractorTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "ParagraphExtractor"

  private val extractionData = Table(
    "input" -> "awaited",
    // BGB
    "§ 1 II S. 1, III 4 Nr. 1 BGB"       -> ParagraphExtraction(0, 28, "§", "BGB", "1 II S. 1, III 4 Nr. 1"),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB" -> ParagraphExtraction(0, 34, "§", "BGB", "1 II 1 Nr. 2, III Nr. 1 1, 2"),
    // HGB
    "§ 1 II S. 1, III 4 Nr. 1 HGB"       -> ParagraphExtraction(0, 28, "§", "HGB", "1 II S. 1, III 4 Nr. 1"),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB" -> ParagraphExtraction(0, 34, "§", "HGB", "1 II 1 Nr. 2, III Nr. 1 1, 2"),
    // LABV
    "Art. 2a IIb 2 Nr. 1c LABV" -> ParagraphExtraction(0, 25, "Art.", "LABV", "2a IIb 2 Nr. 1c"),
    "Art. 11 I, II LABV"        -> ParagraphExtraction(0, 18, "Art.", "LABV", "11 I, II"),
    // GG
    "Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG" -> ParagraphExtraction(0, 35, "Art.", "GG", "12 Abs. 2 S. 1, Abs. 3 S. 2"),
    "Art. 12 Abs. 1, 2 Nr. 1, 2 GG"       -> ParagraphExtraction(0, 29, "Art.", "GG", "12 Abs. 1, 2 Nr. 1, 2"),
    "Art. 12 II 1, III 2 GG"              -> ParagraphExtraction(0, 22, "Art.", "GG", "12 II 1, III 2"),
    "Art. 12 II 1, 2 GG"                  -> ParagraphExtraction(0, 18, "Art.", "GG", "12 II 1, 2"),
    "Art. 12 II 1, 2, III 2 Nr. 1 GG"     -> ParagraphExtraction(0, 31, "Art.", "GG", "12 II 1, 2, III 2 Nr. 1"),
    // PAG
    "Art. 2a IIb 2 Nr. 1c PAG" -> ParagraphExtraction(0, 24, "Art.", "PAG", "2a IIb 2 Nr. 1c"),
    "Art. 11 I, II PAG"        -> ParagraphExtraction(0, 17, "Art.", "PAG", "11 I, II"),
    // POG
    "Art. 2a IIb 2 Nr. 1c POG" -> ParagraphExtraction(0, 24, "Art.", "POG", "2a IIb 2 Nr. 1c"),
    "Art. 11 I, II POG"        -> ParagraphExtraction(0, 17, "Art.", "POG", "11 I, II"),
    // AGVwGO
    "§ 1, 2 AGVwGO" -> ParagraphExtraction(0, 13, "§", "AGVwGO", "1, 2"),
    // VwGO
    "§ 1, 2 VwGO" -> ParagraphExtraction(0, 11, "§", "VwGO", "1, 2")
  )

  it should "extract paragraphs" in forAll(extractionData) { case (text, extracted) =>
    ParagraphExtractor.extract(text) shouldEqual Seq(extracted)
  }

  private val processRestData = Table(
    "rest"                   -> "awaited",
    "49"                     -> Seq("49"),
    "61 ff."                 -> Seq("61 ff."),
    "49 IV"                  -> Seq("49 Abs. 4"),
    "43 I"                   -> Seq("43 Abs. 1"),
    "42 II"                  -> Seq("42 Abs. 2"),
    "62 III"                 -> Seq("62 Abs. 3"),
    "40 I 1"                 -> Seq("40 Abs. 1 S. 1"),
    "38 I S. 1"              -> Seq("38 Abs. 1 S. 1"),
    "49 I 1"                 -> Seq("49 Abs. 1 S. 1"),
    "35 S. 1"                -> Seq("35 S. 1"),
    "51 I 2"                 -> Seq("51 Abs. 1 S. 2"),
    "42 I Var. 1"            -> Seq("42 Abs. 1 Var. 1"),
    "61 Nr. 2"               -> Seq("61 Nr. 2"),
    "62 I Nr. 1"             -> Seq("62 Abs. 1 Nr. 1"),
    "61 Nr. 1 Alt. 2"        -> Seq("61 Nr. 1 Alt. 2"),
    "61 Nr. 1 Alt. 2"        -> Seq("61 Nr. 1 Alt. 2"),
    "43 II, 113 IV"          -> Seq("43 Abs. 2", "113 Abs. 4"),
    "88, 86 I, III"          -> Seq("88", "86 Abs. 1", "86 Abs. 3"),
    "61 Nr. 1 Alt. 1, Nr. 2" -> Seq("61 Nr. 1 Alt. 1", "61 Nr. 2")
  )

  it should "process the rest" in forAll(processRestData) { case (rest, processed) =>
    ParagraphExtractor.processRest(rest) shouldEqual processed
  }

  private val paragraphExtractionData = Table(
    "heading"                          -> "awaitedParagraphExtraction",
    "Sachentscheidungsvoraussetzungen" -> ("Sachentscheidungsvoraussetzungen", Seq.empty),
    "Generalklausel § 40 I 1 VwGO" -> ("Generalklausel", Seq(
      ParagraphExtraction(15, 28, paragraphType = "§", lawCode = "VwGO", rest = "40 I 1")
    )),
    // TODO: try to remove strange artifacts?
    "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO" -> ("Beteiligtenfähig: K,  ,", Seq(
      ParagraphExtraction(21, 43, paragraphType = "§", lawCode = "VwGO", rest = "61 Nr. 1 Alt. 2"),
      ParagraphExtraction(45, 54, paragraphType = "Art.", lawCode = "GO", rest = "1")
    ))
  )

  it should "extract and replace paragraph mentions in headings" in forAll(paragraphExtractionData) { (heading, awaitedParagraphExtraction) =>
    ParagraphExtractor.extractAndReplace(heading) shouldEqual awaitedParagraphExtraction
  }

}
