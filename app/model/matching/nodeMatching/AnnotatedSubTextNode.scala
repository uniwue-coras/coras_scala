package model.matching.nodeMatching

import model.matching.wordMatching.WordWithRelatedWords
import model.{Applicability, SubTextNode}

final case class AnnotatedSubTextNode(
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability,
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
) extends SubTextNode
