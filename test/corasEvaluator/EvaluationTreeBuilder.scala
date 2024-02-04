package corasEvaluator

import model.SolutionTree
import model.exporting.ExportedSolutionNode
import model.matching.nodeMatching.AnnotatedSolutionNode
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordAnnotator

class EvaluationTreeBuilder(wordAnnotator: WordAnnotator):

  def buildSolutionTree(nodes: Seq[ExportedSolutionNode]): SolutionTree = SolutionTree {
    nodes.map { case ExportedSolutionNode(id, childIndex, text, applicability, parentId, subTextNodes) =>
      // TODO: use extractedParagraphCitations!
      val (newText, _ /* extractedParagraphCitations */ ) = ParagraphExtractor.extractAndReplace(text)

      val wordsWithRelatedWords = wordAnnotator.resolveSynonyms(newText)

      val annotatedSolutionNodes = wordAnnotator.annotateSubTextNodes(subTextNodes)

      AnnotatedSolutionNode(id, childIndex, text, applicability, parentId, annotatedSolutionNodes, wordsWithRelatedWords)
    }
  }
