package model.matching.nodeMatching

import model.matching.MatchingResult
import model.matching.paragraphMatching.{ParagraphCitationMatchExplanation, ParagraphMatcher}
import model.matching.wordMatching.{WordMatchExplanation, WordMatcher, WordWithRelatedWords}
import model.{GeneratedSolutionNodeMatch, ParagraphCitation}
import play.api.libs.json.{JsString, Json, Writes}

object TestJsonFormats {

  private val wordMatchingResultWrites: Writes[WordMatcher.WordMatchingResult] = {
    val wordWithSynonymsWrites: Writes[WordWithRelatedWords] = (value) =>
      (value.synonyms, value.antonyms) match {
        case (Seq(), Seq()) => JsString(value.word)
        case (Seq(), ants)  => Json.obj("word" -> value.word, "antonyms" -> ants)
        case (syns, Seq())  => Json.obj("word" -> value.word, "synonyms" -> syns)
        case (syns, ants)   => Json.obj("word" -> value.word, "synonyms" -> syns, "antonyms" -> ants)
      }

    MatchingResult.writesWithCertainty(
      wordWithSynonymsWrites,
      Json.writes[WordMatchExplanation]
    )
  }

  private val paragraphMatchingResultWrites: Writes[ParagraphMatcher.ParagraphMatchingResult] = MatchingResult.writesWithCertainty(
    Json.writes[ParagraphCitation],
    Json.writes[ParagraphCitationMatchExplanation]
  )

  val solutionNodeMatchExplanationWrites: Writes[SolutionNodeMatchExplanation] = (value) => {
    implicit val x0: Writes[WordMatcher.WordMatchingResult]           = wordMatchingResultWrites
    implicit val x1: Writes[ParagraphMatcher.ParagraphMatchingResult] = paragraphMatchingResultWrites

    Json.obj(
      "wordMatchingResult"           -> value.maybeWordMatchingResult,
      "maybeParagraphMatchingResult" -> value.maybeParagraphMatchingResult,
      "certainty"                    -> value.certainty
    )
  }

  val nodeIdMatchFormat: Writes[GeneratedSolutionNodeMatch] = {
    implicit val x1: Writes[ParagraphMatcher.ParagraphMatchingResult] = paragraphMatchingResultWrites
    implicit val x2: Writes[SolutionNodeMatchExplanation]             = solutionNodeMatchExplanationWrites

    Json.writes
  }
}
