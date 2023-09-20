package model.exportModel

import model.TableDefs
import play.api.libs.json.OFormat

import scala.concurrent.{ExecutionContext, Future}

trait Exporter[T, U] {
  val jsonFormat: OFormat[U]
}

trait NodeExporter[T, U] extends Exporter[T, U] {
  def exportData(value: T, tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[U]
}

trait LeafExporter[T, U] extends Exporter[T, U] {
  def exportData(value: T): U
}
