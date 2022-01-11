package model

import play.api.libs.json.{Json, JsonConfiguration, JsonNaming, OFormat}

sealed trait DocxText

final case class NormalText(text: String) extends DocxText

final case class Heading(
  level: Int,
  text: String
) extends DocxText

object DocxText {

  private implicit val jsonConfig: JsonConfiguration = JsonConfiguration(
    discriminator = "type",
    typeNaming = JsonNaming { _.split("\\.").last }
  )

  val jsonFormat: OFormat[DocxText] = {
    implicit val x0: OFormat[NormalText] = Json.format
    implicit val x1: OFormat[Heading]    = Json.format

    Json.format
  }

}
