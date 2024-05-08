package model.exporting

import model.{Correctness, MatchStatus, SolutionNodeMatch, TableDefs}

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double]
) extends SolutionNodeMatch {

  override def getParagraphCitationAnnotations(tableDefs: TableDefs) = ???
  override def getExplanationAnnotation(tableDefs: TableDefs)        = ???

}
