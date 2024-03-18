package model

import model.matching.nodeMatching.{AnnotatedSolutionNode, AnnotatedSolutionTree}
import model.matching.paragraphMatching.ParagraphMatcher

object ParagraphAnnotationGenerator:

  private val errorType      = ErrorType.Missing
  private val annoImportance = AnnotationImportance.Medium

  def generateAnnotations(
    sampleTree: AnnotatedSolutionTree,
    userTree: AnnotatedSolutionTree,
    matches: Seq[DefaultSolutionNodeMatch]
  ): Seq[GeneratedAnnotation] = userTree.nodes.flatMap { case AnnotatedSolutionNode(nodeId, _, _, nodeText, _, _, _, citedParagraphs) =>
    val userCitedParagraphs = citedParagraphs ++ userTree.recursiveCitedParagraphs(nodeId)

    val allSampleCitedParagraphs = matches
      .filter { _.userNodeId == nodeId }
      .map { m => sampleTree.find(m.sampleNodeId).get }
      .flatMap { n => n.citedParagraphs ++ sampleTree.recursiveCitedParagraphs(n.id) }

    ParagraphMatcher.performMatching(allSampleCitedParagraphs, userCitedParagraphs).notMatchedSample match
      case Seq() => None
      case Seq(missingParagraph) =>
        val text = s"""Norm fehlt: ${missingParagraph.stringify()}"""
        Some(GeneratedAnnotation(nodeId, -1, errorType, annoImportance, startIndex = 0, endIndex = nodeText.size - 1, text, None))
      case missingParagraphs =>
        val text = s"""Normen fehlen: ${missingParagraphs.map(_.stringify()).mkString(", ")}"""
        Some(GeneratedAnnotation(nodeId, -1, errorType, annoImportance, startIndex = 0, endIndex = nodeText.size - 1, text, None))
  }
