package model.matching

import model.RelatedWord
import model.matching.wordMatching.WordWithRelatedWords
import model.SolutionNode
import model.matching.nodeMatching.AnnotatedSolutionNode
import model.matching.paragraphMatching.ParagraphExtractor

class WordAnnotator(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):
  def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = for {
    word <- model.matching.wordMatching.WordExtractor.extractWordsNew(text)

    realWord = abbreviations.getOrElse(word, word)

    (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }
  } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))

  def annotateNode(node: SolutionNode): AnnotatedSolutionNode = node match
    case SolutionNode(id, childIndex, isSubText, text, applicability, parentId) =>
      val (newText, paragraphCitationLocations) = ParagraphExtractor.extractAndReplace(text)
      val citedParagraphs                       = paragraphCitationLocations.flatMap { _.citedParagraphs }
      val wordsWithRelatedWords                 = resolveSynonyms(newText)

      AnnotatedSolutionNode(id, childIndex, isSubText, text, applicability, parentId, wordsWithRelatedWords, citedParagraphs)
