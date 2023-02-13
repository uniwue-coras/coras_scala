package model

import org.apache.poi.xwpf.usermodel.XWPFDocument
import play.api.libs.json.{Json, OFormat}

import java.nio.file.{Files, Path}
import scala.jdk.CollectionConverters.CollectionHasAsScala
import scala.util.Try

final case class DocxText(text: String, level: Option[Int] = None)

object DocxText {

  val jsonFormat: OFormat[DocxText] = Json.format

}

object DocxReader {

  private val headingRegex = "^berschrift(\\d)".r

  def readFile(path: Path): Try[Seq[DocxText]] = Try {
    new XWPFDocument(Files.newInputStream(path)).getParagraphs.asScala.toSeq
      .filter { _.getParagraphText.trim().nonEmpty }
      .map { paragraph =>
        val maybeLevel: Option[Int] = for {
          paragraphStyle <- Option(paragraph.getStyle)
          prefixMatch    <- headingRegex.findFirstMatchIn(paragraphStyle.toLowerCase)
          levelGroup     <- Option(prefixMatch.group(1))
        } yield levelGroup.toInt

        DocxText(paragraph.getParagraphText, maybeLevel)
      }
      .dropWhile { _.level.isEmpty }
  }

  def convertLines(lines: Seq[DocxText]) = ???

}
