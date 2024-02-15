package model.matching.nodeMatching

import model.SolutionNode
import model.matching.WordAnnotator
import model.matching.paragraphMatching.ParagraphExtractor

class SolutionTree(val nodes: Seq[AnnotatedSolutionNode]):
  lazy val rootNodes              = nodes.filter { _.parentId.isEmpty }
  def getChildrenFor(nodeId: Int) = nodes.filter { _.parentId contains nodeId }

object SolutionTree:
  def buildWithAnnotator(wordAnnotator: WordAnnotator, nodes: Seq[SolutionNode]) = SolutionTree {
    nodes.map { case SolutionNode(id, childIndex, isSubText, text, applicability, parentId) =>
      val (newText, paragraphCitationLocations) = ParagraphExtractor.extractAndReplace(text)
      val citedParagraphs                       = paragraphCitationLocations.flatMap { _.citedParagraphs }
      val wordsWithRelatedWords                 = wordAnnotator.resolveSynonyms(newText)

      AnnotatedSolutionNode(id, childIndex, isSubText, text, applicability, parentId, wordsWithRelatedWords, citedParagraphs)
    }
  }
