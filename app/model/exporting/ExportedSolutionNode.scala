package model.exporting

import model.{SolutionNode, SubTextNode}

trait ExportedSolutionNode extends SolutionNode:
  def subTextNodes: Seq[SubTextNode]

object ExportedSolutionNode:
  def unapply(solutionNode: ExportedSolutionNode) =
    Some(solutionNode.id, solutionNode.childIndex, solutionNode.text, solutionNode.applicability, solutionNode.parentId, solutionNode.subTextNodes)
