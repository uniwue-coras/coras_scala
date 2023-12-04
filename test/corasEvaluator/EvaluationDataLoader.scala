package corasEvaluator

import better.files._
import model.exporting.ExportedData
import play.api.libs.json.{Json, OFormat}

object EvaluationDataLoader:

  // json reads
  private implicit val exportedDataJsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  private val file = File.home / "uni_nextcloud" / "CorAs" / "export_coras.json"

  def loadData: ExportedData = Json.fromJson { file.inputStream.apply(Json.parse) }.get
