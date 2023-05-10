package model.matching

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class WordExtractorTest extends AnyFlatSpec with Matchers {

  behavior of "WordExtractor"

  private val cases = Seq(
    "Keine Sonderzuweisung"                                        -> Seq("keine", "sonderzuweisung"),
    "Aufdrängende Sonderzuweisung"                                 -> Seq("aufdrängende", "sonderzuweisung"),
    "Trotz irreführendem Wortlaut nichtverfassungsrechtlicher Art" -> Seq("trotz", "irreführendem", "wortlaut", "nichtverfassungsrechtlicher", "art"),
    "Nichtverfassungsrechtlicher Art"                              -> Seq("nichtverfassungsrechtlicher", "art")
  )

  it should "extract new words" in cases.foreach { case (text, awaited) =>
    WordExtractor.extractWordsNew(text) shouldEqual awaited
  }

}
