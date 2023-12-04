package model

import model.matching.paragraphMatching.{ParagraphCitationLocation, ParagraphExtractor}

trait SolutionNode:
  def id: Int
  def childIndex: Int
  def isSubText: Boolean
  def text: String
  def applicability: Applicability
  def parentId: Option[Int]

  lazy val (remainingText, paragraphCitationLocations) = ParagraphExtractor.extractAndReplace(text)
