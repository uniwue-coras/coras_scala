package model

import model.graphql.GraphQLContext
import sangria.schema.{Field, IntType, ListType, ObjectType, fields}

final case class ParagraphCorrelation(
  paragraph: ParagraphSynonymIdentifier,
  sampleNodeIds: Seq[Int],
  userNodeIds: Seq[Int]
)

object ParagraphCorrelation:
  val queryType = ObjectType[GraphQLContext, ParagraphCorrelation](
    "ParagraphCorrelation",
    fields[GraphQLContext, ParagraphCorrelation](
      Field("paragraph", ParagraphSynonymIdentifier.queryType, resolve = _.value.paragraph),
      Field("sampleNodeIds", ListType(IntType), resolve = _.value.sampleNodeIds),
      Field("userNodeIds", ListType(IntType), resolve = _.value.userNodeIds)
    )
  )

  private type ParCorrMap = Map[ParagraphSynonymIdentifier, Set[Int]]

  private def mergeMaps(sampleMap: ParCorrMap, userMap: ParCorrMap): Seq[ParagraphCorrelation] = sampleMap
    .foldLeft((Seq[ParagraphCorrelation](), userMap)) { case ((acc, remainingUserMap), (citedParagraph, sampleNodeIds)) =>
      val (newRemainingUserMap, userNodeIds) = remainingUserMap.get(citedParagraph) match
        case None              => (remainingUserMap, Seq.empty)
        case Some(userNodeIds) => (remainingUserMap - citedParagraph, userNodeIds)

      (acc :+ ParagraphCorrelation(citedParagraph, sampleNodeIds.toSeq, userNodeIds.toSeq), newRemainingUserMap)

    }(0)

  def resolve(sampleNodes: Seq[SolutionNode], userNodes: Seq[SolutionNode]): Seq[ParagraphCorrelation] = {
    val allSampleParagraphs: Seq[(ParagraphSynonymIdentifier, Int)] = for {
      sampleNode     <- sampleNodes
      citedParagraph <- sampleNode.citedParagraphs
    } yield citedParagraph.identifier -> sampleNode.id

    val sampleParCorrMap: ParCorrMap = allSampleParagraphs.groupMap(_._1)(_._2).view.mapValues(_.toSet).toMap

    val allUserParagraphs = for {
      userNode       <- userNodes
      citedParagraph <- userNode.citedParagraphs
    } yield citedParagraph.identifier -> userNode.id

    val userParCorrMap: ParCorrMap = allUserParagraphs.groupMap(_._1)(_._2).view.mapValues(_.toSet).toMap

    mergeMaps(sampleParCorrMap, userParCorrMap)
  }
