package model

sealed trait DocxText

final case class NormalText(text: String) extends DocxText

final case class Heading(
  level: Int,
  text: String
) extends DocxText
