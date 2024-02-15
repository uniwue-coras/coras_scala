package model.matching.nodeMatching

import model.SolutionNode
import model.matching.WordAnnotator

class SolutionTree(val nodes: Seq[AnnotatedSolutionNode]):
  lazy val rootNodes              = nodes.filter { _.parentId.isEmpty }
  def getChildrenFor(nodeId: Int) = nodes.filter { _.parentId contains nodeId }

object SolutionTree:

  def buildWithAnnotator(wordAnnotator: WordAnnotator, nodes: Seq[SolutionNode]) = SolutionTree { nodes.map { wordAnnotator.annotateNode } }
