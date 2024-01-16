package model.matching.nodeMatching

import model.FlatSampleSolutionNode
import model.SampleSubTextNode
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordWithRelatedWords
import model.matching.wordMatching.WordExtractor
import model.RelatedWord
import model.FlatUserSolutionNode
import model.UserSubTextNode

final case class SolutionNodeContainer(
  node: FlatSolutionNodeWithData,
  children: Seq[SolutionNodeContainer]
)

object SolutionNodeContainer:

  private def buildChildren(
    parentId: Option[Int],
    remainingNodes: Seq[FlatSolutionNodeWithData]
  ): (Seq[SolutionNodeContainer], Seq[FlatSolutionNodeWithData]) = {
    // find children
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    // build tree container nodes for chilren...
    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes)) { case ((acc, remainingNodes), current) =>
      val (children, newRemainingNodes) = buildChildren(Some(current.nodeId), remainingNodes)

      (acc :+ SolutionNodeContainer(current, children), newRemainingNodes)
    }
  }

  def buildTree(nodes: Seq[FlatSolutionNodeWithData]): Seq[SolutionNodeContainer] = {
    val (result, nodesLeftOver) = buildChildren(None, nodes)

    assert(nodesLeftOver.isEmpty)

    result
  }

class SolutionNodeContainerTreeBuilder(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):

  private def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = for {
    word <- WordExtractor.extractWordsNew(text)

    // replace with expanded word if abbreviation
    realWord = abbreviations.getOrElse(word, word)

    (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }
  } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))

  // build sample tree

  type InterimSampleBuildResult = (Seq[SolutionNodeContainer], Seq[FlatSampleSolutionNode], Seq[SampleSubTextNode])

  def buildSampleChildren(
    parentId: Option[Int],
    remainingNodes: Seq[FlatSampleSolutionNode],
    remainingSubTexts: Seq[SampleSubTextNode]
  ): InterimSampleBuildResult = {
    // find children...
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    childrenForCurrent.foldLeft[InterimSampleBuildResult]((Seq[SolutionNodeContainer](), otherRemainingNodes, remainingSubTexts)) {
      case ((acc, remainingNodes, remainingSubTexts), current) =>
        val (ownSubTexts, otherRemainingSubTexNodes) = remainingSubTexts.partition(_.nodeId == current.id)

        val (children, newRemainingNodes, newRemainingSubTexNodes) = buildSampleChildren(Some(current.id), remainingNodes, otherRemainingSubTexNodes)

        val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(current.text)

        val nodeWithData = FlatSolutionNodeWithData(
          nodeId = current.id,
          text = current.text,
          parentId = current.parentId,
          subTextNodes = ownSubTexts,
          paragraphCitationLocations = extractedParagraphCitations,
          wordsWithRelatedWords = resolveSynonyms(newText)
        )

        (acc :+ SolutionNodeContainer(nodeWithData, children), newRemainingNodes, newRemainingSubTexNodes)
    }
  }

  def buildSampleSolutionTree(
    nodes: Seq[FlatSampleSolutionNode],
    subTexts: Seq[SampleSubTextNode]
  ) = {
    val (result, remainingNodes, remainingSubTexts) = buildSampleChildren(None, nodes, subTexts)

    assert(remainingNodes.isEmpty)
    assert(remainingSubTexts.isEmpty)

    result
  }

  type InterimUserBuildResult = (Seq[SolutionNodeContainer], Seq[FlatUserSolutionNode], Seq[UserSubTextNode])

  def buildUserChildren(parentId: Option[Int], remainingNodes: Seq[FlatUserSolutionNode], remainingSubTexts: Seq[UserSubTextNode]): InterimUserBuildResult = ???

  def buildUserSolutionTree(
    nodes: Seq[FlatUserSolutionNode],
    subTexts: Seq[UserSubTextNode]
  ) = {
    val (result, remainingNodes, remainingSubTexts) = buildUserChildren(None, nodes, subTexts)

    assert(remainingNodes.isEmpty)
    assert(remainingSubTexts.isEmpty)

    result
  }
