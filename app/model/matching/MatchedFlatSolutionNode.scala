package model.matching

import model.IFlatSolutionNode

final case class MatchedFlatSolutionNode(
  solutionNode: IFlatSolutionNode,
  wordsWithSynonyms: Seq[WordWithSynonyms]
)
