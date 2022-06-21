package model

import play.api.libs.json.{Json, OFormat}

final case class CorrectionValues(
  sampleSolution: Seq[SolutionNode],
  userSolution: Seq[SolutionNode]
)

object CorrectionValues {

  val correctionValuesJsonFormat: OFormat[CorrectionValues] = {
    implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

    Json.format
  }

}
