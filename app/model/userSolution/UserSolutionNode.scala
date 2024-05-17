package model.userSolution

import model.{Applicability, SolutionNode, SolutionNodeInput}
import model.Importance

final case class UserSolutionNodeKey(username: String, exerciseId: Int, id: Int)

final case class UserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  focusIntensity: Option[Importance],
  parentId: Option[Int]
) extends SolutionNode {
  def dbKey = UserSolutionNodeKey(username, exerciseId, id)
}

object UserSolutionNode {
  def fromInput(username: String, exerciseId: Int): (SolutionNodeInput) => UserSolutionNode = {
    case SolutionNodeInput(nodeId, childIndex, text, applicability, subText, focusIntensity, parentId) =>
      UserSolutionNode(username, exerciseId, nodeId, childIndex, text, applicability, subText, focusIntensity, parentId)
  }
}
