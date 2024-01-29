package corasEvaluator

import model.SubTextNode
import model.exporting.{ExportedFlatSampleSolutionNode, ExportedSampleSubTextNode}
import model.matching.nodeMatching.{AnnotatedSubTextNode, SolutionNodeContainerTreeBuilder}
import model.matching.wordMatching.WordAnnotator

class EvaluationNodeAnnotator(wordAnnotator: WordAnnotator) extends SolutionNodeContainerTreeBuilder(wordAnnotator):

  def annotateSampleNodes(nodes: Seq[ExportedFlatSampleSolutionNode]): Seq[AnnotatedSubTextNode] = ???
