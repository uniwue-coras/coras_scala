package model.matching.nodeMatching

import model.SolutionNode
import model.graphql.GraphQLContext
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, MatchingResult}
import sangria.schema.{ObjectType, interfaces}

class AnnotatedSolutionNodeMatcher(sampleTree: AnnotatedSolutionTree, userTree: AnnotatedSolutionTree)
    extends FuzzyMatcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation]:

  override protected val defaultCertaintyThreshold: Double = 0.2

  override protected def checkCertainMatch(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode): Boolean = left.text.trim == right.text.trim

  // FIXME: match sub texts and / node chilren and use child similarity!
  override def generateFuzzyMatchExplanation(
    sample: AnnotatedSolutionNode,
    user: AnnotatedSolutionNode
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    maybeWordMatchingResult = WordMatcher.performMatchingIfNotEmpty(sample.wordsWithRelatedWords, user.wordsWithRelatedWords),
    maybeParagraphMatchingResult = ParagraphMatcher.performMatchingIfNotEmpty(sample.citedParagraphs, user.citedParagraphs),
    maybeDirectChildrenMatchingResult = performMatchingIfNotEmpty(sampleTree.getChildrenFor(sample.id), userTree.getChildrenFor(user.id))
  )

  def explainIfNotCorrect(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode) =
    if checkCertainMatch(left, right) then None else Some(generateFuzzyMatchExplanation(left, right))

object AnnotatedSolutionNodeMatcher:
  private val annotatedSolutionNodeQueryType = ObjectType[GraphQLContext, AnnotatedSolutionNode](
    "AnnotatedSolutionNode",
    interfaces[GraphQLContext, AnnotatedSolutionNode](SolutionNode.interfaceType),
    Nil
  )

  val queryType: ObjectType[GraphQLContext, NodeMatchingResult] =
    MatchingResult.queryType("DirectChildren", annotatedSolutionNodeQueryType, SolutionNodeMatchExplanation.queryType)
