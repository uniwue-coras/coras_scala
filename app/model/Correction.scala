package model

import com.scalatsi.{TSIType, TSNamedType, TSType}

import scala.concurrent.{ExecutionContext, Future}

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
)

final case class SolutionNodeMatchingResult(
  matches: Seq[SolutionNodeMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
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

  val correctionJsonFormat: OFormat[SolutionNodeMatchingResult] = solutionNodeMatchingResultJsonFormat

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

  val correctionType: TSIType[SolutionNodeMatchingResult] = solutionNodeMatchingResultType

}

trait CorrectionRepository {
  self: play.api.db.slick.HasDatabaseConfig[slick.jdbc.JdbcProfile] =>

  import MyPostgresProfile.api._

  private type CorrectionRow = (Int, String, SolutionNodeMatchingResult)

  private object correctionsTQ extends TableQuery[CorrectionsTable](new CorrectionsTable(_)) {
    def forExAndUser(exerciseId: Int, username: String): Query[CorrectionsTable, CorrectionRow, Seq] = correctionsTQ.filter { corr =>
      corr.exerciseId === exerciseId && corr.username === username
    }
  }

  protected implicit val ec: ExecutionContext

  def futureCorrectionForExerciseAndUser(exerciseId: Int, username: String): Future[Option[SolutionNodeMatchingResult]] = for {
    mongoCorrection <- db.run(correctionsTQ.forExAndUser(exerciseId, username).result.headOption)
  } yield mongoCorrection.map(_._3)

  def futureUsersWithCorrection(exerciseId: Int): Future[Seq[String]] = db.run(
    correctionsTQ
      .filter { _.exerciseId === exerciseId }
      .map { _.username }
      .distinct
      .result
  )

  def futureUserHasCorrection(exerciseId: Int, username: String): Future[Boolean] = for {
    lineCount <- db.run(correctionsTQ.forExAndUser(exerciseId, username).length.result)
  } yield lineCount > 0

  def futureInsertCorrection(exerciseId: Int, username: String, correction: SolutionNodeMatchingResult): Future[Boolean] = for {
    lineCount <- db.run(correctionsTQ += (exerciseId, username, correction))
  } yield lineCount == 1

  def futureDeleteCorrection(exerciseId: Int, username: String): Future[Unit] = for {
    _ <- db.run(correctionsTQ.forExAndUser(exerciseId, username).delete)
  } yield ()

  private class CorrectionsTable(tag: Tag) extends Table[CorrectionRow](tag, "corrections") {

    def exerciseId = column[Int]("exercise_id")

    def username = column[String]("username")

    def correction = column[SolutionNodeMatchingResult]("correction_json")

    override def * = (exerciseId, username, correction)

  }

}
