package model

import better.files.File
import org.apache.poi.xwpf.usermodel.XWPFDocument

import scala.jdk.CollectionConverters.CollectionHasAsScala

object DocxReader {

  private val headingRegex = "^Berschrift(\\d)".r

  def readFile(file: File): Seq[DocxText] = new XWPFDocument(file.newFileInputStream).getParagraphs.asScala
    .filter { _.getParagraphText.trim().nonEmpty }
    .map { paragraph =>
      headingRegex.findPrefixMatchOf(paragraph.getStyle).flatMap(m => Option(m.group(1))).map(_.toInt) match {
        case Some(level) => Heading(level, paragraph.getParagraphText)
        case None        => NormalText(paragraph.getParagraphText)
      }
    }
    .dropWhile { _.isInstanceOf[NormalText] }
    .toSeq

}
