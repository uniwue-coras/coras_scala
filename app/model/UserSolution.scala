package model

import enumeratum.{EnumEntry, PlayEnum}
import model.graphql.SolutionIdentifier
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

import scala.annotation.unused
import scala.concurrent.Future

sealed trait CorrectionStatus extends EnumEntry

object CorrectionStatus extends PlayEnum[CorrectionStatus] {

  case object Waiting  extends CorrectionStatus
  case object Ongoing  extends CorrectionStatus
  case object Finished extends CorrectionStatus

  override def values: IndexedSeq[CorrectionStatus] = findValues

  val graphQLType: EnumType[CorrectionStatus] = deriveEnumType()

}

final case class UserSolutionInput(
  username: String,
  solution: Seq[FlatSolutionNodeInput]
)

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: String
)

trait UserSolutionsRepository {
  self: TableDefs =>

  import profile.api._

  protected val userSolutionsTQ = TableQuery[UserSolutionsTable]

  def futureUserSolutionsForExercise(exerciseId: Int): Future[Seq[UserSolution]] = db.run(
    userSolutionsTQ.filter { _.exerciseId === exerciseId }.result
  )

  def futureMaybeUserSolution(username: String, exerciseId: Int): Future[Option[UserSolution]] = db.run(
    userSolutionsTQ
      .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
      .result
      .headOption
  )

  def futureSelectMySolutionIdentifiers(username: String): Future[Seq[SolutionIdentifier]] = for {
    rows <- db.run(
      userSolutionsTQ
        .filter { _.username === username }
        .map { userSol => (userSol.exerciseId, userSol.correctionStatus) }
        .result
    )
  } yield rows.map { case (exerciseId, correctionStatus) => SolutionIdentifier(exerciseId, correctionStatus) }

  def futureUpdateCorrectionStatus(exerciseId: Int, username: String, newCorrectionStatus: CorrectionStatus): Future[Unit] = for {
    _ <- db.run(
      userSolutionsTQ
        .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
        .map { _.correctionStatus }
        .update(newCorrectionStatus)
    )
  } yield ()

  def futureUserSolutionByReviewUuid(reviewUuid: String): Future[Option[UserSolution]] = db.run(
    userSolutionsTQ
      .filter { _.reviewUuid === reviewUuid }
      .result
      .headOption
  )

  protected class UserSolutionsTable(tag: Tag) extends Table[UserSolution](tag, "user_solutions") {
    def username         = column[String]("username")
    def exerciseId       = column[Int]("exercise_id")
    def correctionStatus = column[CorrectionStatus]("correction_status", O.Default(CorrectionStatus.Waiting))
    def reviewUuid       = column[String]("review_uuid", O.Unique)

    @unused def pk = primaryKey("user_solutions_pk", (username, exerciseId))

    @unused def exerciseFk = foreignKey(s"user_solutions_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, correctionStatus, reviewUuid) <> (UserSolution.tupled, UserSolution.unapply)
  }

}
