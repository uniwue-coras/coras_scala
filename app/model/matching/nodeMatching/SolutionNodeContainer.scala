package model.matching.nodeMatching

final case class SolutionNodeContainer(
  node: AnnotatedSolutionNode,
  children: Seq[SolutionNodeContainer]
) {
  def text                  = node.text
  def subTextNodes          = node.subTextNodes
  def wordsWithRelatedWords = node.wordsWithRelatedWords
}
