package model.matching.nodeMatching

class AnnotatedSolutionTree(val nodes: Seq[AnnotatedSolutionNode]):
  lazy val rootNodes              = nodes.filter { _.parentId.isEmpty }
  def getChildrenFor(nodeId: Int) = nodes.filter { _.parentId contains nodeId }

  def find(nodeId: Int) = nodes.find { _.id == nodeId }

  def getNodeChildrenFor(nodeId: Int) = getChildrenFor(nodeId).filter { !_.isSubText }
  def getSubTextsFor(nodeId: Int)     = getChildrenFor(nodeId).filter { _.isSubText }
