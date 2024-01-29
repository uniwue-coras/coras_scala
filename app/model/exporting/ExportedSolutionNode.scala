package model.exporting

import model.{SolutionNode, SubTextNode}

trait ExportedSolutionNode extends SolutionNode:
  def subTextNodes: Seq[SubTextNode]
