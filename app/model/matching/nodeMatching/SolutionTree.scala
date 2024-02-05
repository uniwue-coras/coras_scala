package model.matching.nodeMatching

import model.SolutionNode
import model.matching.WordAnnotator
import model.matching.paragraphMatching.ParagraphExtractor

class SolutionTree(nodes: Seq[AnnotatedSolutionNode]):
  lazy val getRootNodes: Seq[AnnotatedSolutionNode]             = nodes.filter { _.parentId.isEmpty }
  def getChildrenFor(parentId: Int): Seq[AnnotatedSolutionNode] = nodes.filter { _.parentId contains parentId }

object SolutionTree:
  def buildFrom(wordAnnotator: WordAnnotator, nodes: Seq[SolutionNode]): SolutionTree = SolutionTree {
    nodes.map { case SolutionNode(id, _ /* childIndex*/, _ /* isSubText */, text, _ /* applicability */, parentId) =>
      val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(text)
      val wordsWithRelatedWords                  = wordAnnotator.resolveSynonyms(newText)

      AnnotatedSolutionNode(id, text, parentId, extractedParagraphCitations, wordsWithRelatedWords)
    }
  }
