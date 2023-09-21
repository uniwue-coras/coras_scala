package de.uniwue.ls6.corasModel

trait SolutionNodeMatch {
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]
}
