package model.matching

import model.RelatedWord
import model.matching.wordMatching.WordWithRelatedWords

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
