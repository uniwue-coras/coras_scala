package model

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with SolutionRepository
    with SubTextRepository
    with SolutionNodeMatchesRepository {

  import profile.api._

  protected implicit val applicabilityType: JdbcType[Applicability] =
    MappedColumnType.base[Applicability, String](_.entryName, Applicability.withNameInsensitive)

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
