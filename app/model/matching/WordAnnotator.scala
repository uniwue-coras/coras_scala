package model.matching

import model.matching.nodeMatching.{AnnotatedSolutionNode, AnnotatedSolutionTree}
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordWithRelatedWords
import model.{RelatedWord, SolutionNode}

import scala.concurrent.{ExecutionContext, Future}

trait WordAnnotator:

  protected val abbreviations: Map[String, String]
  protected val relatedWordGroups: Seq[Seq[RelatedWord]]

  protected def extractWords(text: String)(implicit ec: ExecutionContext): Future[Seq[String]]

  private def resolveSynonyms(text: String)(implicit ec: ExecutionContext): Future[Seq[WordWithRelatedWords]] = for {
    words <- extractWords(text)

    wordsWithRelatedWords = for {
      word <- words
      realWord = abbreviations.getOrElse(word, word)

      (synonyms, antonyms) = relatedWordGroups
        .find { _.exists { _.word == realWord } }
        .getOrElse(Seq.empty)
        .filter { _.word != realWord }
        .partition { _.isPositive }
    } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))
  } yield wordsWithRelatedWords

  def annotateNode(node: SolutionNode)(implicit ec: ExecutionContext): Future[AnnotatedSolutionNode] = node match
    case SolutionNode(id, childIndex, isSubText, text, applicability, parentId) =>
      val (newText, paragraphCitationLocations) = ParagraphExtractor.extractAndReplace(text)
      val citedParagraphs                       = paragraphCitationLocations.flatMap { _.citedParagraphs }

      for {
        wordsWithRelatedWords <- resolveSynonyms(newText)
      } yield AnnotatedSolutionNode(id, childIndex, isSubText, text, applicability, parentId, wordsWithRelatedWords, citedParagraphs)

  def buildSolutionTree(nodes: Seq[SolutionNode])(implicit ec: ExecutionContext): Future[AnnotatedSolutionTree] = for {
    annotatedNodes <- Future.traverse(nodes)(annotateNode)
  } yield AnnotatedSolutionTree(annotatedNodes)
