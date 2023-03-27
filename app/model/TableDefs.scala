package model

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with UserSolutionsRepository
    with SolutionNodeRepository
    with SolutionNodeMatchesRepository
    with AnnotationRepository {

  import profile.api._

  protected val cascade: ForeignKeyAction = ForeignKeyAction.Cascade

  protected implicit val applicabilityType: JdbcType[Applicability]       = MappedColumnType.base(_.entryName, Applicability.withNameInsensitive)
  protected implicit val correctionStatusType: JdbcType[CorrectionStatus] = MappedColumnType.base(_.entryName, CorrectionStatus.withNameInsensitive)
  protected implicit val matchStatusType: JdbcType[MatchStatus]           = MappedColumnType.base(_.entryName, MatchStatus.withNameInsensitive)
  protected implicit val errorTypeType: JdbcType[ErrorType]               = MappedColumnType.base(_.entryName, ErrorType.withNameInsensitive)

  def futureInsertExercise(title: String, text: String, sampleSolutions: Seq[FlatSolutionNodeInput]): Future[Int] = {
    val actions = for {
      exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text)

      _ /* nodesInserted */ <- sampleSolutionNodesTQ ++= sampleSolutions.map {
        case FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
          FlatSampleSolutionNode(exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    } yield exerciseId

    db.run(actions.transactionally)
  }

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[FlatSolutionNodeInput]): Future[Unit] = {
    val actions = for {
      _ <- userSolutionsTQ += UserSolution(username, exerciseId, CorrectionStatus.Waiting)

      _ <- userSolutionNodesTQ ++= userSolution.map { case FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
        FlatUserSolutionNode(username, exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    } yield ()

    db.run(actions.transactionally)
  }

  def futureInsertCorrection(exerciseId: Int, username: String, matches: Seq[SolutionNodeMatch]): Future[CorrectionStatus] = {
    val actions = for {
      _ <- matchesTQ ++= matches

      _ <- userSolutionsTQ
        .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
        .map(_.correctionStatus)
        .update(CorrectionStatus.Ongoing)
    } yield CorrectionStatus.Ongoing

    db.run(actions.transactionally)
  }

}
