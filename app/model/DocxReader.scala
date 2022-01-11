package model

import better.files.File
import org.apache.poi.xwpf.usermodel.XWPFDocument

import scala.jdk.CollectionConverters.CollectionHasAsScala

object DocxReader {
  private val headingRegex = "^Berschrift(\\d)".r

  def readTexts(name: String): Seq[DocxText] = {
    val file = File.currentWorkingDirectory / "data" / name

    new XWPFDocument(file.newFileInputStream).getParagraphs.asScala
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

  def readDocx(name: String): Unit = {

    val xs = readTexts(name)

    println("------------------------------------------------")
    xs.foreach(println)
  }

}
