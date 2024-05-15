package model.exporting

import model.{Correctness, MatchStatus, ParagraphCitationAnnotation, SolutionNodeMatch, TableDefs}

import scala.concurrent.Future

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double]
) extends SolutionNodeMatch {

  override def getParagraphCitationAnnotation(tableDefs: TableDefs, awaitedParagraph: String): Future[Option[ParagraphCitationAnnotation]] = ???
  override def getParagraphCitationAnnotations(tableDefs: TableDefs)                                                                         = ???
  override def getExplanationAnnotation(tableDefs: TableDefs)                                                                                = ???

}
