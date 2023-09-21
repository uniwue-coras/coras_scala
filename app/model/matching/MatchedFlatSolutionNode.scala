package model.matching

import model.IFlatSolutionNode

private[matching] final case class MatchedFlatSolutionNode(
  private val solutionNode: IFlatSolutionNode,
  wordsWithSynonyms: Seq[WordWithSynonymsAntonyms]
) {

  def nodeId: Int           = solutionNode.id
  def text: String          = solutionNode.text
  def parentId: Option[Int] = solutionNode.parentId

}
