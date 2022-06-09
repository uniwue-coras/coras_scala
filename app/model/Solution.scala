package model

import play.api.libs.json.{Format, Json, OFormat}

final case class SolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionEntrySubText],
  children: Seq[SolutionNode]
)

final case class CorrectionValues(
  sampleSolution: Seq[SolutionNode],
  userSolution: Seq[SolutionNode]
)

object Solution {

  type Solution = Seq[SolutionNode]

  type SubTextBaseType = (Int, String, Applicability)

  def inflateSolution(
    entries: Seq[FlatSolutionEntry],
    subTexts: Seq[SubTextBaseType],
    parentId: Option[Int] = None
  ): (Seq[SolutionNode], Seq[SubTextBaseType], Seq[FlatSolutionEntry]) = {

    val (childNodes, otherNodes) = entries.partition(_.parentId == parentId)

    childNodes.zipWithIndex.foldLeft((Seq.empty[SolutionNode], subTexts, otherNodes)) {
        case ((acc, remainingSubTexts, remainingOtherNodes), (FlatSolutionEntry(_, _, id, text, applicability, _), childIndex)) =>
          val (baseSubTexts, otherSubTexts) = remainingSubTexts.partition(_._1 == id)

          val (children, newRemainingSubTexts, newRemainingOtherNodes) = inflateSolution(remainingOtherNodes, otherSubTexts, Some(id))

          val subTexts = baseSubTexts.map { case (_, text, applicability) => SolutionEntrySubText(text, applicability) }

          (acc :+ SolutionNode(id, childIndex, text, applicability, subTexts, children.sortBy(_.id)), newRemainingSubTexts, newRemainingOtherNodes)
      }
  }

  private val solutionNodeFormat: OFormat[SolutionNode] = {
    implicit val x0: Format[SolutionEntrySubText] = Json.format

    Json.format
  }

  val correctionValuesJsonFormat: OFormat[CorrectionValues] = {
    implicit val x0: OFormat[SolutionNode] = solutionNodeFormat

    Json.format
  }

}
