package model

import model.userSolution.{UserSolutionNode, UserSolutionsRepository}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with RelatedWordGroupRepository
    with RelatedWordRepository
    with AbbreviationsRepository
    with ExerciseRepository
    with UserSolutionsRepository
    with SolutionNodeRepository
    with SolutionNodeMatchesRepository
    with AnnotationRepository
    with ParagraphCitationAnnotationRepository
    with ParagraphSynonymRepository
    with CorrectionSummaryRepository {

  import profile.api._

  protected val cascade: ForeignKeyAction = ForeignKeyAction.Cascade

  protected implicit val applicabilityType: JdbcType[Applicability]               = MappedColumnType.base(_.entryName, Applicability.withNameInsensitive)
  protected implicit val correctionStatusType: JdbcType[CorrectionStatus]         = MappedColumnType.base(_.entryName, CorrectionStatus.withNameInsensitive)
  protected implicit val correctnessType: JdbcType[Correctness]                   = MappedColumnType.base(_.entryName, Correctness.withNameInsensitive)
  protected implicit val matchStatusType: JdbcType[MatchStatus]                   = MappedColumnType.base(_.entryName, MatchStatus.withNameInsensitive)
  protected implicit val annotationImportanceType: JdbcType[AnnotationImportance] = MappedColumnType.base(_.entryName, AnnotationImportance.withNameInsensitive)
  protected implicit val errorTypeType: JdbcType[ErrorType]                       = MappedColumnType.base(_.entryName, ErrorType.withNameInsensitive)
  protected implicit val annotationTypeType: JdbcType[AnnotationType]             = MappedColumnType.base(_.entryName, AnnotationType.withNameInsensitive)

  def futureInsertExercise(title: String, sampleSolutions: Seq[SolutionNodeInput]): Future[Int] = {
    val actions = for {
      exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title)

      _ /* nodesInserted */ <- sampleSolutionNodesTQ ++= sampleSolutions.map {
        case SolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
          SampleSolutionNode(exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    } yield exerciseId

    db.run(actions.transactionally)
  }

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[SolutionNodeInput]): Future[Unit] = {
    val actions = for {
      _ <- userSolutionsTQ.map { us => (us.username, us.exerciseId) } += (username, exerciseId)

      _ <- userSolutionNodesTQ ++= userSolution.map { case SolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
        UserSolutionNode(username, exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    } yield ()

    db.run(actions.transactionally)
  }

  def futureInsertCorrection(
    exerciseId: Int,
    username: String,
    matches: Seq[DbSolutionNodeMatch],
    paragraphCitationAnnotations: Seq[DbParagraphCitationAnnotation]
  ): Future[CorrectionStatus] = {
    val actions = for {
      _ <- matchesTQ ++= matches
      _ <- paragraphCitationAnnotationsTQ ++= paragraphCitationAnnotations
      _ <- userSolutionsTQ
        .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
        .map(_.correctionStatus)
        .update(CorrectionStatus.Ongoing)
    } yield CorrectionStatus.Ongoing

    db.run(actions.transactionally)
  }

  protected abstract class HasForeignKeyOnUserSolutionNodeTable[T](tag: Tag, _tableName: String) extends Table[T](tag, _tableName) {
    def username   = column[String]("username")
    def exerciseId = column[Int]("exercise_id")
    def userNodeId = column[Int]("user_node_id")

    def userNodeFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )
  }
}
