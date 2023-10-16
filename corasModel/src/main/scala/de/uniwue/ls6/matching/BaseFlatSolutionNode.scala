package de.uniwue.ls6.matching

final case class BaseFlatSolutionNode(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
