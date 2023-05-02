package model.docxReading

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor2}

class ParagraphExtractorTest extends AnyFlatSpec with Matchers with TableDrivenPropertyChecks {

  behavior of "ParagraphExtractor"

  private val data: TableFor2[String, ParagraphExtraction] = Table(
    ("text", "extracted"),
    // BGB
    ("§ 1 II S. 1, III 4 Nr. 1 BGB", ParagraphExtraction(0, 28, "§", "BGB", "1 II S. 1, III 4 Nr. 1")),
    ("§ 1 II 1 Nr. 2, III Nr. 1 1, 2 BGB", ParagraphExtraction(0, 34, "§", "BGB", "1 II 1 Nr. 2, III Nr. 1 1, 2")),
    // HGB
    ("§ 1 II S. 1, III 4 Nr. 1 HGB", ParagraphExtraction(0, 28, "§", "HGB", "1 II S. 1, III 4 Nr. 1")),
    ("§ 1 II 1 Nr. 2, III Nr. 1 1, 2 HGB", ParagraphExtraction(0, 34, "§", "HGB", "1 II 1 Nr. 2, III Nr. 1 1, 2")),
    // LABV
    ("Art. 2a IIb 2 Nr. 1c LABV", ParagraphExtraction(0, 25, "Art.", "LABV", "2a IIb 2 Nr. 1c")),
    ("Art. 11 I, II LABV", ParagraphExtraction(0, 18, "Art.", "LABV", "11 I, II")),
    // GG
    ("Art. 12 Abs. 2 S. 1, Abs. 3 S. 2 GG", ParagraphExtraction(0, 35, "Art.", "GG", "12 Abs. 2 S. 1, Abs. 3 S. 2")),
    ("Art. 12 Abs. 1, 2 Nr. 1, 2 GG", ParagraphExtraction(0, 29, "Art.", "GG", "12 Abs. 1, 2 Nr. 1, 2")),
    ("Art. 12 II 1, III 2 GG", ParagraphExtraction(0, 22, "Art.", "GG", "12 II 1, III 2")),
    ("Art. 12 II 1, 2 GG", ParagraphExtraction(0, 18, "Art.", "GG", "12 II 1, 2")),
    ("Art. 12 II 1, 2, III 2 Nr. 1 GG", ParagraphExtraction(0, 31, "Art.", "GG", "12 II 1, 2, III 2 Nr. 1")),
    // PAG
    ("Art. 2a IIb 2 Nr. 1c PAG", ParagraphExtraction(0, 24, "Art.", "PAG", "2a IIb 2 Nr. 1c")),
    ("Art. 11 I, II PAG", ParagraphExtraction(0, 17, "Art.", "PAG", "11 I, II")),
    // POG
    ("Art. 2a IIb 2 Nr. 1c POG", ParagraphExtraction(0, 24, "Art.", "POG", "2a IIb 2 Nr. 1c")),
    ("Art. 11 I, II POG", ParagraphExtraction(0, 17, "Art.", "POG", "11 I, II")),
    // AGVwGO
    ("§ 1, 2 AGVwGO", ParagraphExtraction(0, 13, "§", "AGVwGO", "1, 2")),
    // VwGO
    ("§ 1, 2 VwGO", ParagraphExtraction(0, 11, "§", "VwGO", "1, 2"))
  )

  it should "extract paragraphs" in forAll(data) { (text, extracted) =>
    ParagraphExtractor.extract(text) shouldEqual Seq(extracted)
  }

}
