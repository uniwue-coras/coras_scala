package model.matching

import model.DbRelatedWord
import play.api.libs.json.{JsError, JsObject, JsSuccess, JsValue}
import play.api.libs.ws._

import scala.concurrent.{ExecutionContext, Future}

class SpacyWordAnnotator(ws: WSClient, override val abbreviations: Map[String, String], override val relatedWordGroups: Seq[Seq[DbRelatedWord]])
    extends WordAnnotator {

  private val spacyUrl = "http://localhost:5011"

  override protected def extractWords(text: String)(implicit ec: ExecutionContext): Future[Seq[String]] = for {
    result <- ws
      .url(spacyUrl)
      .addHttpHeaders(
        "Content-Type" -> "text/plain",
        "Accept"       -> "application/json"
      )
      .post(text)

    validatedJson <- result.body[JsValue].validate[JsObject] match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(new Exception("TODO!"))
    }
  } yield validatedJson.keys.toSeq
}
