package model

trait SolutionNodeMatch {
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]
}
