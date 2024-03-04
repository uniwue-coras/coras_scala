package model.matching.wordMatching

import model.graphql.GraphQLContext
import sangria.schema.{Field, ListType, ObjectType, StringType, fields}

final case class WordWithRelatedWords(
  word: String,
  synonyms: Seq[String] = Seq.empty,
  antonyms: Seq[String] = Seq.empty
):
  def allWords = word +: (synonyms ++ antonyms)

object WordWithRelatedWords:
  val queryType: ObjectType[GraphQLContext, WordWithRelatedWords] = ObjectType(
    "WordWithRelatedWords",
    fields[GraphQLContext, WordWithRelatedWords](
      Field("word", StringType, resolve = _.value.word),
      Field("synonyms", ListType(StringType), resolve = _.value.synonyms),
      Field("antonyms", ListType(StringType), resolve = _.value.antonyms)
    )
  )
