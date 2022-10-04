package model

import com.github.tminglei.slickpg.{ExPostgresProfile, PgEnumSupport}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

trait MyPostgresProfile extends ExPostgresProfile with PgEnumSupport {

  trait MyAPI extends API {

    implicit val rightsType: JdbcType[Rights] = createEnumJdbcType("rights", _.entryName, Rights.withNameInsensitive, quoteName = false)

    implicit val applicabilityType: JdbcType[Applicability] =
      createEnumJdbcType("applicability", _.entryName, Applicability.withNameInsensitive, quoteName = false)

  }

  override val api: MyAPI = new MyAPI {}

}

object MyPostgresProfile extends MyPostgresProfile

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with SolutionRepository
    with SubTextRepository
    with SolutionNodeMatchesRepository {

  import MyPostgresProfile.api._

  def futureInsertExercise(title: String, text: String, sampleSolutions: Seq[FlatSolutionNodeInput]): Future[Int] = {

    val actions = for {
      exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text)

      (sampleSolutionNodes, subTextInsertValues) = sampleSolutions.foldLeft[(Seq[DbSolutionRow], Seq[DbSubTextRow])]((Seq.empty, Seq.empty)) {
        case ((nodeInserts, subTextInserts), FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subTexts, parentId)) =>
          (
            nodeInserts :+ (exerciseId, nodeId, childIndex, text, applicability, parentId),
            subTextInserts ++ subTexts.map { case SolutionNodeSubText(subTextId, text) => (exerciseId, nodeId, subTextId, text) }
          )
      }

      _ /* nodesInserted */ <- sampleSolutionNodesTQ ++= sampleSolutionNodes

      _ /* subTextsInserted */ <- sampleSubTextsTQ ++= subTextInsertValues

    } yield exerciseId

    db.run(actions.transactionally)
  }

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[FlatSolutionNodeInput]): Future[Unit] = {

    val (nodeInsertValues, subTextInsertValues) = userSolution.foldLeft[(Seq[DbUserSolutionRow], Seq[DbUserSubTextRow])]((Seq.empty, Seq.empty)) {
      case ((nodeInserts, subTextInserts), FlatSolutionNodeInput(nodeId, childIndex, text, applicability, subTexts, parentId)) =>
        (
          nodeInserts :+ (username, (exerciseId, nodeId, childIndex, text, applicability, parentId)),
          subTextInserts ++ subTexts.map { case SolutionNodeSubText(subTextId, text) => (username, (exerciseId, nodeId, subTextId, text)) }
        )
    }

    val actions = for {
      _ /* nodesInserted */ <- userSolutionNodesTQ ++= nodeInsertValues

      _ /* subTextsInserted */ <- userSubTextsTQ ++= subTextInsertValues
    } yield ()

    db.run(actions.transactionally)
  }

}
