package model.docxReading

import model.ls6.matching.ParagraphExtractor
import org.apache.poi.xwpf.usermodel.{XWPFDocument, XWPFParagraph}

import java.nio.file.{Files, Path}
import scala.jdk.CollectionConverters.CollectionHasAsScala
import scala.util.Try

object DocxReader {

  private val headingRegex = "^berschrift(\\d)".r

  private def extractLevelFromParagraph(paragraph: XWPFParagraph): Option[Int] = for {
    paragraphStyle <- Option(paragraph.getStyle)
    prefixMatch    <- headingRegex.findFirstMatchIn(paragraphStyle.toLowerCase)
    levelGroup     <- Option(prefixMatch.group(1))
  } yield levelGroup.toInt

  def readFile(path: Path): Try[Seq[DocxText]] = Try {
    new XWPFDocument(Files.newInputStream(path)).getParagraphs.asScala.toSeq
      .filter { _.getParagraphText.trim().nonEmpty }
      .map { paragraph =>
        val text = paragraph.getParagraphText.replaceAll("\u00a0", " ")

        DocxText(text, extractLevelFromParagraph(paragraph), ParagraphExtractor.extract(text))
      }
      .dropWhile { _.level.isEmpty }
  }

}
