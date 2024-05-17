package model.matching

import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNode, AnnotatedUserSolutionTree}
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordWithRelatedWords
import model.{DbRelatedWord, SolutionNode}

import scala.concurrent.{ExecutionContext, Future}

trait WordAnnotator {

  protected val abbreviations: Map[String, String]
  protected val relatedWordGroups: Seq[Seq[DbRelatedWord]]

  protected def extractWords(text: String)(implicit ec: ExecutionContext): Future[Seq[String]]

  private def resolveSynonyms(text: String)(implicit ec: ExecutionContext): Future[Seq[WordWithRelatedWords]] = for {
    words <- extractWords(text)

    wordsWithRelatedWords = for {
      word <- words
      realWord = abbreviations.getOrElse(word.toLowerCase(), word)

      (synonyms, antonyms) = relatedWordGroups
        .find { _.exists { _.word == realWord } }
        .getOrElse(Seq.empty)
        .filter { _.word != realWord }
        .partition { _.isPositive }
    } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))
  } yield wordsWithRelatedWords

  def annotateNode(node: SolutionNode)(implicit ec: ExecutionContext): Future[AnnotatedSolutionNode] = node match {
    case SolutionNode(id, childIndex, isSubText, text, applicability, focusIntensity, parentId) =>
      val (newText, paragraphCitationLocations) = ParagraphExtractor.extractAndRemove(text)
      val citedParagraphs                       = paragraphCitationLocations.flatMap { _.citedParagraphs }

      for {
        wordsWithRelatedWords <- resolveSynonyms(newText)
      } yield AnnotatedSolutionNode(id, childIndex, isSubText, text, applicability, focusIntensity, parentId, wordsWithRelatedWords, citedParagraphs)
  }

  def buildSampleSolutionTree(nodes: Seq[SolutionNode])(implicit ec: ExecutionContext): Future[AnnotatedSampleSolutionTree] = for {
    annotatedNodes <- Future.traverse(nodes)(annotateNode)
  } yield new AnnotatedSampleSolutionTree(annotatedNodes)

  def buildUserSolutionTree(nodes: Seq[SolutionNode])(implicit ec: ExecutionContext): Future[AnnotatedUserSolutionTree] = for {
    annotatedNodes <- Future.traverse(nodes)(annotateNode)
  } yield new AnnotatedUserSolutionTree(annotatedNodes)

}
