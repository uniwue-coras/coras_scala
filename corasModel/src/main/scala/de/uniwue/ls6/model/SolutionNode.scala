package de.uniwue.ls6.model

trait SolutionNode {
  def id: Int
  def childIndex: Int
  def isSubText: Boolean
  def text: String
  def applicability: Applicability
  def parentId: Option[Int]
}