package model.matching.wordMatching

import model.RelatedWord

class WordAnnotator(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):
  def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = for {
    word <- WordExtractor.extractWords(text)

    // replace with expanded word if abbreviation
    realWord = abbreviations.getOrElse(word, word)

    (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }
  } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))
