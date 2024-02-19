package model.matching.paragraphMatching

import model.{CitedParag, ParagraphCitationLocation}
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
    "§ 1 II S. 1, III 4 Nr. 1 BGB" -> ParagraphCitationLocation(
      0,
      28,
      Seq(
        "BGB" paragraph 1 section 2 withRest "S. 1",
        "BGB" paragraph 1 section 3 withRest "S. 4 Nr. 1"
      )
    ),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB" -> ParagraphCitationLocation(
      0,
      34,
      Seq(
        "BGB" paragraph 1 section 2 withRest "S. 1 Nr. 2",
        "BGB" paragraph 1 section 3 withRest "Nr. 1 S. 1",
        "BGB" paragraph 2
      )
    ),
    // HGB
    "§ 1 II S. 1, III 4 Nr. 1 HGB" -> ParagraphCitationLocation(
      0,
      28,
      Seq(
        "HGB" paragraph 1 section 2 withRest "S. 1",
        "HGB" paragraph 1 section 3 withRest "S. 4 Nr. 1"
      )
    ),
    "§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB" -> ParagraphCitationLocation(
      0,
      34,
      Seq(
        "HGB" paragraph 1 section 2 withRest "S. 1 Nr. 2",
        "HGB" paragraph 1 section 3 withRest "Nr. 1 S. 1",
        "HGB" paragraph 2
      )
    ),
    // LABV
    "Art. 2 IIb 2 Nr. 1c LABV" -> ParagraphCitationLocation(
      0,
      24,
      Seq(
        "LABV" article 2 section 2 withRest "b S. 2 Nr. 1c"
      )
    ),
    "Art. 11 I, II LABV" -> ParagraphCitationLocation(
      0,
      18,
      Seq(
        "LABV" article 11 section 1,
        "LABV" article 11 section 2
      )
    ),
    // GG
    "Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG" -> ParagraphCitationLocation(
      0,
      35,
      Seq(
        "GG" article (12) section 2 withRest "S. 1",
        "GG" article (12) section 3 withRest "S. 2"
      )
    ),
    // "Art. 12 Abs. 1, 2 Nr. 1, 2 GG"       -> ParagraphCitation(0, 29, "Art.", "GG", "12" -> Seq("Abs. 1", "Abs. 2 Nr. 1, 2")),
    "Art. 12 II 1, III 2 GG" -> ParagraphCitationLocation(
      0,
      22,
      Seq(
        "GG" article 12 section 2 withRest "S. 1",
        "GG" article 12 section 3 withRest "S. 2"
      )
    ),
    // "Art. 12 II 1, 2 GG"                  -> ParagraphCitation(0, 18, "Art.", "GG", "12" -> Seq("Abs. 2 1, 2")),
    // "Art. 12 II 1, 2, III 2 Nr. 1 GG"     -> ParagraphCitation(0, 31, "Art.", "GG", "12" -> Seq("Abs. 2 S. 1, S. 2", "Abs. 3 S. 2 Nr. 1")),
    // PAG
    "Art. 2 IIb 2 Nr. 1c PAG" -> ParagraphCitationLocation(
      0,
      23,
      Seq(
        "PAG" article 2 section 2 withRest "b S. 2 Nr. 1c"
      )
    ),
    "Art. 11 I, II PAG" -> ParagraphCitationLocation(
      0,
      17,
      Seq(
        "PAG" article 11 section 1,
        "PAG" article 11 section 2
      )
    ),
    // POG
    "Art. 2 IIb 2 Nr. 1c POG" -> ParagraphCitationLocation(
      0,
      23,
      Seq(
        "POG" article 2 section 2 withRest "b S. 2 Nr. 1c"
      )
    ),
    "Art. 11 I, II POG" -> ParagraphCitationLocation(
      0,
      17,
      Seq(
        "POG" article 11 section 1,
        "POG" article 11 section 2
      )
    ),
    // AGVwGO
    "§ 1, 2 AGVwGO" -> ParagraphCitationLocation(
      0,
      13,
      Seq(
        "AGVwGO" paragraph 1,
        "AGVwGO" paragraph 2
      )
    ),
    // VwGO
    "§ 1, 2 VwGO" -> ParagraphCitationLocation(
      0,
      11,
      Seq(
        "VwGO" paragraph 1,
        "VwGO" paragraph 2
      )
    )
  )

  it should "extract paragraphs" in forAll(extractionData) { case (text, extracted) =>
    model.matching.paragraphMatching.ParagraphExtractor.extractFrom(text) shouldEqual Seq(extracted)
  }

  private val processRestData = Table[String, Seq[CitedParag]](
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
    model.matching.paragraphMatching.ParagraphExtractor.processRest(rest) shouldEqual processed
  }

  private val paragraphExtractionData = Table[String, String, Seq[ParagraphCitationLocation]](
    ("heading", "awaitedRest", "awaitedParagraphCitation"),
    ("Sachentscheidungsvoraussetzungen", "Sachentscheidungsvoraussetzungen", Seq.empty),
    (
      "Generalklausel § 40 I 1 VwGO",
      "Generalklausel",
      Seq(
        ParagraphCitationLocation(
          15,
          28,
          Seq("VwGO" paragraph 40 section 1 withRest "S. 1")
        )
      )
    ),
    (
      "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO",
      "Beteiligtenfähig: K,  ,",
      Seq(
        ParagraphCitationLocation(
          21,
          43,
          Seq("VwGO" paragraph 61 withRest "Nr. 1 Alt. 2")
        ),
        ParagraphCitationLocation(
          45,
          54,
          Seq("GO" article 1)
        )
      )
    ),
    (
      "Prozessfähig: § 62 III VwGO, Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO",
      "Prozessfähig:  ,",
      Seq(
        // § 62 III VwGO",
        ParagraphCitationLocation(
          14,
          27,
          Seq(
            "VwGO" paragraph 62 section 3
          )
        ),
        // Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO
        ParagraphCitationLocation(
          29,
          67,
          Seq(
            "GO" article 29,
            "GO" article 34 section 1 withRest "S. 2",
            "GO" article 37 section 1 withRest "S. 1 Nr. 1",
            "GO" article 38 section 1
          )
        )
      )
    )
  )

  it should "extract and replace paragraph mentions in headings" in forAll(paragraphExtractionData) { (heading, awaitedRest, awaitedParagraphCitation) =>
    model.matching.paragraphMatching.ParagraphExtractor.extractAndReplace(heading) shouldEqual (awaitedRest, awaitedParagraphCitation)
  }
