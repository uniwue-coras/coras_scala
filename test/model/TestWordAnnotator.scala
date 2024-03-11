package model

import model.matching.WordAnnotator
import model.matching.wordMatching.WordExtractor

import scala.concurrent.{ExecutionContext, Future}

class TestWordAnnotator(override val abbreviations: Map[String, String], override val relatedWordGroups: Seq[Seq[RelatedWord]]) extends WordAnnotator:
  override protected def extractWords(text: String)(implicit ec: ExecutionContext): Future[Seq[String]] = Future.successful { WordExtractor.extractWords(text) }
