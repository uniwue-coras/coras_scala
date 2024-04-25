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
) extends SolutionNodeMatch:
  override def paragraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]] = Future.successful { Seq.empty }
