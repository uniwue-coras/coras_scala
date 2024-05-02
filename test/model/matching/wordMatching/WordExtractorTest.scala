package model.matching.wordMatching

import munit.FunSuite

class WordExtractorTest extends FunSuite {

  private val cases = Seq(
    "Keine Sonderzuweisung"                                        -> Seq("keine", "sonderzuweisung"),
    "Aufdrängende Sonderzuweisung"                                 -> Seq("aufdrängende", "sonderzuweisung"),
    "Trotz irreführendem Wortlaut nichtverfassungsrechtlicher Art" -> Seq("trotz", "irreführendem", "wortlaut", "nichtverfassungsrechtlicher", "art"),
    "Nichtverfassungsrechtlicher Art"                              -> Seq("nichtverfassungsrechtlicher", "art"),
    "Öffentlich-rechtliche Streitigkeit"                           -> Seq("öffentlichrechtliche", "streitigkeit"),
    "Nichtverfassungsmäßiger Art"                                  -> Seq("nichtverfassungsmäßiger", "art")
  )

  test("it should extract new words") {
    for {
      (text, awaited) <- cases
    } yield assertEquals(WordExtractor.extractWords(text), awaited)
  }
}
