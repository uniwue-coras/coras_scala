package model.matching.nodeMatching

import corasEvaluator.{FalseNegativeDebugExplanation, FalsePositiveDebugExplanation}
import model.matching.MatchingResult
import model.matching.paragraphMatching.{ParagraphCitationLocation, ParagraphCitationMatchExplanation, ParagraphMatchingResult}
import model.matching.wordMatching.{FuzzyWordMatchExplanation, WordMatchingResult, WordWithRelatedWords}
import play.api.libs.json.{JsString, Json, OWrites, Writes}

object TestJsonFormats:

  private val wordMatchingResultWrites: Writes[WordMatchingResult] = {
    val wordWithSynonymsWrites: Writes[WordWithRelatedWords] = (value) =>
      (value.synonyms, value.antonyms) match {
        case (Seq(), Seq()) => JsString(value.word)
        case (Seq(), ants)  => Json.obj("word" -> value.word, "antonyms" -> ants)
        case (syns, Seq())  => Json.obj("word" -> value.word, "synonyms" -> syns)
        case (syns, ants)   => Json.obj("word" -> value.word, "synonyms" -> syns, "antonyms" -> ants)
      }

    MatchingResult.writesWithCertainty(
      wordWithSynonymsWrites,
      Json.writes[FuzzyWordMatchExplanation]
    )
  }

  private val paragraphMatchingResultWrites: Writes[ParagraphMatchingResult] = MatchingResult.writesWithCertainty(
    ParagraphCitationLocation.paragraphCitationFormat,
    Json.writes[ParagraphCitationMatchExplanation]
  )

  val solutionNodeMatchExplanationWrites: Writes[SolutionNodeMatchExplanation] = (value) => {
    implicit val x0: Writes[WordMatchingResult]      = wordMatchingResultWrites
    implicit val x1: Writes[ParagraphMatchingResult] = paragraphMatchingResultWrites

    Json.obj(
      "wordMatchingResult"           -> value.wordMatchingResult,
      "maybeParagraphMatchingResult" -> value.maybeParagraphMatchingResult,
      "certainty"                    -> value.certainty
    )
  }

  val nodeIdMatchFormat: Writes[TestSolutionNodeMatch] = {
    implicit val x2: Writes[SolutionNodeMatchExplanation] = solutionNodeMatchExplanationWrites

    Json.writes
  }

  val falseNegativeDebgExplanationJsonWrites: Writes[FalseNegativeDebugExplanation] = Json.writes

  val FalsePositiveDebugExplanationJsonWrites: Writes[FalsePositiveDebugExplanation] = {
    implicit val x0: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites

    Json.writes
  }
