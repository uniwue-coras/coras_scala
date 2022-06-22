package model

import com.scalatsi.{TSIType, TSNamedType, TSType}
import model.matching.Match
import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.play.json.compat.json2bson._

import scala.concurrent.Future

final case class SolutionMatchComment(
  startIndex: Int,
  endIndex: Int,
  comment: String
)

final case class SolutionNodeMatch(
  sampleValue: SolutionNode,
  userValue: SolutionNode,
  childMatches: SolutionNodeMatchingResult,
  comments: Seq[SolutionMatchComment]
) extends Match[SolutionNode]

final case class SolutionNodeMatchingResult(
  matches: Seq[SolutionNodeMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
)

final case class Correction(
  rootMatchingResult: SolutionNodeMatchingResult
)

final case class MongoCorrection(
  exerciseId: Int,
  username: String,
  correction: Correction
)

object Correction {

  // JSON format

  import play.api.libs.functional.syntax._
  import play.api.libs.json._

  private implicit val solutionNodeJsonFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

  private implicit val solutionMatchCommentJsonFormat: OFormat[SolutionMatchComment] = Json.format

  private implicit lazy val nodeCorrectionMatchJsonFormat: Format[SolutionNodeMatch] = (
    (__ \ "sampleValue").format[SolutionNode] and
      (__ \ "userValue").format[SolutionNode] and
      (__ \ "childMatches").lazyFormat[SolutionNodeMatchingResult](solutionNodeMatchingResultJsonFormat) and
      (__ \ "comments").format[Seq[SolutionMatchComment]]
  )(SolutionNodeMatch.apply, unlift(SolutionNodeMatch.unapply))

  private implicit val solutionNodeMatchingResultJsonFormat: OFormat[SolutionNodeMatchingResult] = (
    (__ \ "matches").format[Seq[SolutionNodeMatch]] and
      (__ \ "notMatchedSample").format[Seq[SolutionNode]] and
      (__ \ "notMatchedUser").format[Seq[SolutionNode]]
  )(SolutionNodeMatchingResult.apply, unlift(SolutionNodeMatchingResult.unapply))

  val correctionJsonFormat: OFormat[Correction] = Json.format

  // TS Type

  private val nodeCorrectionMatchType: TSIType[SolutionNodeMatch] = {
    implicit val x0: TSNamedType[SolutionNodeMatchingResult] = TSType.external[SolutionNodeMatchingResult]("ISolutionNodeMatchingResult")
    implicit val x1: TSIType[SolutionNode]                   = SolutionNode.solutionNodeTsType

    TSType.fromCaseClass
  }

  private val solutionNodeMatchingResultType: TSIType[SolutionNodeMatchingResult] = {
    implicit val x0: TSIType[SolutionNodeMatch] = nodeCorrectionMatchType
    implicit val x1: TSIType[SolutionNode]      = SolutionNode.solutionNodeTsType

    TSType.fromCaseClass
  }

  val correctionType: TSIType[Correction] = {
    implicit val x0: TSIType[SolutionNodeMatchingResult] = solutionNodeMatchingResultType

    TSType.fromCaseClass
  }

}

trait MongoCorrectionRepo extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val correctionJsonFormat: OFormat[MongoCorrection] = {
    implicit val x0: OFormat[Correction] = Correction.correctionJsonFormat

    Json.format
  }

  private def futureCorrectionsCollection: Future[BSONCollection] = futureCollection("corrections")

  def futureCorrectionForExerciseAndUser(exerciseId: Int, username: String): Future[Option[Correction]] = for {
    correctionsCollection <- futureCorrectionsCollection
    maybeCorrection       <- correctionsCollection.find(BSONDocument("exerciseId" -> exerciseId, "username" -> username)).one[MongoCorrection]
  } yield maybeCorrection.map(_.correction)

  def futureUsersWithCorrection(exerciseId: Int): Future[Seq[String]] = for {
    correctionsCollection <- futureCorrectionsCollection
    userNameFields <- correctionsCollection
      .find(BSONDocument("exerciseId" -> exerciseId), Some(BSONDocument("username" -> 1)))
      .cursor[UserNameExtractor]()
      .collect[Seq]()
  } yield userNameFields.map(_.username)

  def futureUserHasCorrection(exerciseId: Int, username: String): Future[Boolean] = for {
    correctionsCollection <- futureCorrectionsCollection
    correctionsCount      <- correctionsCollection.count(Some(BSONDocument("exerciseId" -> exerciseId, "username" -> username)))
  } yield correctionsCount > 0

  def futureInsertCorrection(exerciseId: Int, username: String, correction: Correction): Future[Boolean] = for {
    correctionsCollection <- futureCorrectionsCollection
    insertResult          <- correctionsCollection.insert.one(MongoCorrection(exerciseId, username, correction))
  } yield insertResult.n == 1

  def futureDeleteCorrection(exerciseId: Int, username: String): Future[Unit] = for {
    correctionsCollection <- futureCorrectionsCollection
    _                     <- correctionsCollection.delete.one(BSONDocument("exerciseId" -> exerciseId, "username" -> username))
  } yield ()

}
