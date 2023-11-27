package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TestJsonFormats}
import play.api.libs.json.{Json, Writes}

trait DebugExplanation:
  def sampleNodeId: Int
  def sampleText: String
  def userNodeId: Int
  def userText: String

final case class CertainDebugExplanation(
  sampleNodeId: Int,
  sampleText: String,
  userNodeId: Int,
  userText: String
) extends DebugExplanation

final case class FuzzyFalseNegativeDebugExplanation(
  sampleNodeId: Int,
  sampleText: String,
  userNodeId: Int,
  userText: String,
  maybeCertainty: Double
) extends DebugExplanation

final case class FuzzyFalsePositiveDebugExplanation(
  sampleNodeId: Int,
  sampleText: String,
  userNodeId: Int,
  userText: String,
  explanation: SolutionNodeMatchExplanation
) extends DebugExplanation

object DebugExplanations:
  val certainDebugExplanationJsonWrites: Writes[CertainDebugExplanation] = Json.writes

  val falseNegativeDebugExplanationJsonWrites: Writes[FuzzyFalseNegativeDebugExplanation] = Json.writes

  val fuzzyFalsePositiveDebugExplanationJsonWrites: Writes[FuzzyFalsePositiveDebugExplanation] = {
    implicit val x0: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites

    Json.writes
  }
