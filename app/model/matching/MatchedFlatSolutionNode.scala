package model.matching

import model.IFlatSolutionNode

private[matching] final case class MatchedFlatSolutionNode(
  solutionNode: IFlatSolutionNode,
  wordsWithSynonyms: Seq[WordWithSynonymsAntonyms]
)
