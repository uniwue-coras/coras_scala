package model

import org.apache.poi.xwpf.usermodel.XWPFDocument

import java.io.FileInputStream
import scala.jdk.CollectionConverters.CollectionHasAsScala

object DocxReader {
  private val headingRegex = "^Berschrift(\\d)".r

  def readTexts(name: String): Seq[DocxText] = new XWPFDocument(new FileInputStream(name)).getParagraphs.asScala
    .filter { _.getParagraphText.trim().nonEmpty }
    .map { it =>
      val level = headingRegex
        .findPrefixMatchOf(it.getStyle)
        .flatMap(m => Option(m.group(1)))
        .map(_.toInt)

      level match {
        case Some(level) => Heading(level, it.getParagraphText)
        case None        => NormalText(it.getParagraphText)
      }
    }
    .dropWhile { x => x.isInstanceOf[NormalText] }
    .toSeq

  def readDocx(name: String) {

    val xs = readTexts(name)

    println("------------------------------------------------")
    xs.foreach(println)
  }

}
