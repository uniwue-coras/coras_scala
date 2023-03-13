package model

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with SolutionNodeRepository
    with SolutionNodeMatchesRepository
    with AnnotationRepository {

  import profile.api._

  protected implicit val applicabilityType: JdbcType[Applicability] =
    MappedColumnType.base[Applicability, String](_.entryName, Applicability.withNameInsensitive)

  def futureInsertExercise(title: String, text: String, sampleSolutions: Seq[FlatSolutionNodeInput]): Future[Int] = {

    val actions = for {
      exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text)

      _ /* nodesInserted */ <- sampleSolutionNodesTQ ++= sampleSolutions.map {
        case FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
          FlatSolutionNode(exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    } yield exerciseId

    db.run(actions.transactionally)
  }

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[FlatSolutionNodeInput]): Future[Unit] = for {
    _ <- db.run(
      userSolutionNodesTQ ++= userSolution.map { case FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subText, parentId) =>
        FlatUserSolutionNode(username, exerciseId, nodeId, childIndex, text, applicability, subText, parentId)
      }
    )
  } yield ()

}
