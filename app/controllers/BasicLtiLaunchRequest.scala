package controllers

import play.api.data.Form
import play.api.data.Forms._

final case class BasicLtiLaunchRequest(
  userId: String,
  extLms: String,
  extUserUsername: String
)

object BasicLtiLaunchRequest {
  val basicLtiLaunchRequestForm: Form[BasicLtiLaunchRequest] = Form(
    mapping(
      "user_id"           -> text,
      "ext_lms"           -> text,
      "ext_user_username" -> text
    )(BasicLtiLaunchRequest.apply)(BasicLtiLaunchRequest.unapply)
  )
}
