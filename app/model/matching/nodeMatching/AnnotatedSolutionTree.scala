package model.matching.nodeMatching

import model.ParagraphCitation

abstract class AnnotatedSolutionTree(val nodes: Seq[AnnotatedSolutionNode]):
  lazy val rootNodes              = nodes.filter { _.parentId.isEmpty }
  def getChildrenFor(nodeId: Int) = nodes.filter { _.parentId contains nodeId }

  def find(nodeId: Int) = nodes.find { _.id == nodeId }

  def getNodeChildrenFor(nodeId: Int) = getChildrenFor(nodeId).filter { !_.isSubText }
  def getSubTextsFor(nodeId: Int)     = getChildrenFor(nodeId).filter { _.isSubText }

  def recursiveCitedParagraphs(parentId: Int): Seq[ParagraphCitation] =
    getSubTextsFor(parentId).flatMap { case node => node.citedParagraphs ++ recursiveCitedParagraphs(node.id) }

class AnnotatedSampleSolutionTree(sampleNodes: Seq[AnnotatedSolutionNode]) extends AnnotatedSolutionTree(sampleNodes)

class AnnotatedUserSolutionTree(userNodes: Seq[AnnotatedSolutionNode]) extends AnnotatedSolutionTree(userNodes)
