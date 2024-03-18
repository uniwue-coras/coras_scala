package model.matching.paragraphMatching

import model.{ParagraphCitationLocation, ParagraphCitation}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.TableDrivenPropertyChecks

import scala.language.implicitConversions

class ParagraphExtractorTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks with ParagraphTestHelpers:

  behavior of "ParagraphExtractor"

  private val extractionData = Table[String, ParagraphCitationLocation](
    // TODO: broken  tests...
    "input" -> "awaited",
    // "BGB"
    "§ 1 II S. 1, III 4 Nr. 1 BGB" -> location(
      0 to 28,
      "BGB" paragraph "1" section 2 withRest "S. 1",
      "BGB" paragraph "1" section 3 withRest "S. 4 Nr. 1"
    ),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB" -> location(
      0 to 34,
      "BGB" paragraph "1" section 2 withRest "S. 1 Nr. 2",
      "BGB" paragraph "1" section 3 withRest "Nr. 1 S. 1",
      "BGB" paragraph "2"
    ),
    // HGB
    "§ 1 II S. 1, III 4 Nr. 1 HGB" -> location(0 to 28, "HGB" paragraph "1" section 2 withRest "S. 1", "HGB" paragraph "1" section 3 withRest "S. 4 Nr. 1"),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB" -> location(
      0 to 34,
      "HGB" paragraph "1" section 2 withRest "S. 1 Nr. 2",
      "HGB" paragraph "1" section 3 withRest "Nr. 1 S. 1",
      "HGB" paragraph "2"
    ),
    // LABV
    "Art. 2 IIb 2 Nr. 1c LABV" -> location(0 to 24, "LABV" article "2" section 2 withRest "b S. 2 Nr. 1c"),
    "Art. 11 I, II LABV"       -> location(0 to 18, "LABV" article "11" section 1, "LABV" article "11" section 2),
    // GG
    "Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG" -> location(0 to 35, "GG" article "12" section 2 withRest "S. 1", "GG" article "12" section 3 withRest "S. 2"),
    // "Art. 12 Abs. 1, 2 Nr. 1, 2 GG"       -> ParagraphCitation(0, 29, "Art.", "GG", "12" -> Seq("Abs. 1", "Abs. 2 Nr. 1, 2")),
    "Art. 12 II 1, III 2 GG" -> location(0 to 22, "GG" article "12" section 2 withRest "S. 1", "GG" article "12" section 3 withRest "S. 2"),
    // "Art. 12 II 1, 2 GG"                  -> ParagraphCitation(0, 18, "Art.", "GG", "12" -> Seq("Abs. 2 1, 2")),
    // "Art. 12 II 1, 2, III 2 Nr. 1 GG"     -> ParagraphCitation(0, 31, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1, S. 2", "Abs. 3 S. 2 Nr. 1")),
    // PAG
    "Art. 2 IIb 2 Nr. 1c PAG" -> location(0 to 23, "PAG" article "2" section 2 withRest "b S. 2 Nr. 1c"),
    "Art. 11 I, II PAG"       -> location(0 to 17, "PAG" article "11" section 1, "PAG" article "11" section 2),
    // POG
    "Art. 2 IIb 2 Nr. 1c POG" -> location(0 to 23, "POG" article "2" section 2 withRest "b S. 2 Nr. 1c"),
    "Art. 11 I, II POG"       -> location(0 to 17, "POG" article "11" section 1, "POG" article "11" section 2),
    // AGVwGO
    "§ 1, 2 AGVwGO" -> location(0 to 13, "AGVwGO" paragraph "1", "AGVwGO" paragraph "2"),
    // StPO
    "§ 163b StPO" -> location(0 to 11, "StPO" paragraph "163b"),
    // VwGO
    "§ 1, 2 VwGO" -> location(0 to 11, "VwGO" paragraph "1", "VwGO" paragraph "2"),
    "§ 23 EGGVG"  -> location(0 to 9, "EGGVG" article "23")
  )

  it should "extract paragraphs" in forAll(extractionData) { case (text, extracted) =>
    ParagraphExtractor.extractFrom(text) shouldEqual Seq(extracted)
  }

  private val processRestData = Table[String, Seq[(String, String)]](
    "rest"                   -> "awaited",
    "49"                     -> Seq("49" -> ""),
    "61 ff."                 -> Seq("61" -> "ff."),
    "49 IV"                  -> Seq("49" -> "Abs. 4"),
    "43 I"                   -> Seq("43" -> "Abs. 1"),
    "42 II"                  -> Seq("42" -> "Abs. 2"),
    "62 III"                 -> Seq("62" -> "Abs. 3"),
    "40 I 1"                 -> Seq("40" -> "Abs. 1 S. 1"),
    "38 I S. 1"              -> Seq("38" -> "Abs. 1 S. 1"),
    "49 I 1"                 -> Seq("49" -> "Abs. 1 S. 1"),
    "35 S. 1"                -> Seq("35" -> "S. 1"),
    "51 I 2"                 -> Seq("51" -> "Abs. 1 S. 2"),
    "42 I Var. 1"            -> Seq("42" -> "Abs. 1 Var. 1"),
    "61 Nr. 2"               -> Seq("61" -> "Nr. 2"),
    "62 I Nr. 1"             -> Seq("62" -> "Abs. 1 Nr. 1"),
    "61 Nr. 1 Alt. 2"        -> Seq("61" -> "Nr. 1 Alt. 2"),
    "61 Nr. 1 Alt. 2"        -> Seq("61" -> "Nr. 1 Alt. 2"),
    "163b"                   -> Seq("163b" -> ""),
    "43 II, 113 IV"          -> Seq("43" -> "Abs. 2", "113" -> "Abs. 4"),
    "61 Nr. 1 Alt. 1, Nr. 2" -> Seq("61" -> "Nr. 1 Alt. 1", "61" -> "Nr. 2"),
    "88, 86 I, III"          -> Seq("86" -> "Abs. 1", "86" -> "Abs. 3", "88" -> "")
  )

  it should "process the rest" in forAll(processRestData) { case (rest, awaited) =>
    ParagraphExtractor.processRest(rest) shouldEqual awaited.sortBy { _._1 }
  }

  private val paragraphExtractionData = Table[String, String, Seq[ParagraphCitationLocation]](
    ("heading", "awaitedRest", "awaitedParagraphCitation"),
    ("Sachentscheidungsvoraussetzungen", "Sachentscheidungsvoraussetzungen", Seq.empty),
    (
      "Generalklausel § 40 I 1 VwGO",
      "Generalklausel",
      Seq(
        location(15 to 28, "VwGO" paragraph "40" section 1 withRest "S. 1")
      )
    ),
    (
      "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO",
      "Beteiligtenfähig: K,  ,",
      Seq(
        location(21 to 43, "VwGO" paragraph "61" withRest "Nr. 1 Alt. 2"),
        location(45 to 54, "GO" article "1")
      )
    ),
    (
      "Prozessfähig: § 62 III VwGO, Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO",
      "Prozessfähig:  ,",
      Seq(
        // § 62 III VwGO",
        location(14 to 27, "VwGO" paragraph "62" section 3),
        // Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO
        location(
          29 to 67,
          "GO" article "29",
          "GO" article "34" section 1 withRest "S. 2",
          "GO" article "37" section 1 withRest "S. 1 Nr. 1",
          "GO" article "38" section 1
        )
      )
    )
  )

  it should "extract and replace paragraph mentions in headings" in forAll(paragraphExtractionData) { (heading, awaitedRest, awaitedParagraphCitation) =>
    ParagraphExtractor.extractAndReplace(heading) shouldEqual (awaitedRest, awaitedParagraphCitation)
  }
