package model

import better.files.File
import org.apache.poi.xwpf.usermodel.XWPFDocument

import scala.jdk.CollectionConverters.CollectionHasAsScala
import scala.util.Try

class DocxReadException(msg: String, cause: Throwable) extends Exception(msg, cause)

object DocxReader {

  private val headingRegex = "^berschrift(\\d)".r

  def readFile(file: File): Try[Seq[DocxText]] = Try {
    new XWPFDocument(file.newFileInputStream).getParagraphs.asScala.toSeq
      .filter { _.getParagraphText.trim().nonEmpty }
      .map { paragraph =>
        val maybeLevel: Option[Int] = for {
          paragraphStyle <- Option(paragraph.getStyle)
          prefixMatch    <- headingRegex.findFirstMatchIn(paragraphStyle.toLowerCase)
          levelGroup     <- Option(prefixMatch.group(1))
        } yield levelGroup.toInt

        maybeLevel match {
          case Some(level) => Heading(level, paragraph.getParagraphText)
          case None        => NormalText(paragraph.getParagraphText)
        }
      }
      .dropWhile {
        _.isInstanceOf[NormalText]
      }
  }

}
