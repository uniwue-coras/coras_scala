package model

import model.matching.nodeMatching.AnnotatedSolutionNode
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordAnnotator

class SolutionTree(val nodes: Seq[AnnotatedSolutionNode]):
  def getRootNodes = nodes.filter { _.parentId.isEmpty }

  def getChildrenFor(nodeId: Int) = nodes.filter { _.parentId == Some(nodeId) }

object SolutionTree:

  def buildFrom(wordAnnotator: WordAnnotator, nodes: Seq[SolutionNode], subTextNodes: Seq[SubTextNode]): SolutionTree = SolutionTree {
    nodes.map { case SolutionNode(id, childIndex, text, applicability, parentId) =>
      // TODO: use extractedParagraphCitations!
      val (newText, _ /* extractedParagraphCitations */ ) = ParagraphExtractor.extractAndReplace(text)

      val wordsWithRelatedWords = wordAnnotator.resolveSynonyms(newText)

      val annotatedSubTextNodes = wordAnnotator.annotateSubTextNodes(subTextNodes.filter { _.nodeId == id })

      AnnotatedSolutionNode(id, childIndex, text, applicability, parentId, annotatedSubTextNodes, wordsWithRelatedWords)
    }
  }
