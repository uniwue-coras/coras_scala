package model

import com.scalatsi.{TSIType, TSNamedType, TSType}
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

final case class SolutionNodeSubText(text: String, applicability: Applicability)

final case class SolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  children: Seq[SolutionNode]
) extends TreeNode[SolutionNode]

object SolutionNode {

  val solutionNodeSubTextJsonFormat: OFormat[SolutionNodeSubText] = Json.format

  val solutionNodeJsonFormat: OFormat[SolutionNode] = {
    implicit val x0: OFormat[SolutionNodeSubText] = solutionNodeSubTextJsonFormat

    Json.format
  }

  val solutionNodeTsType: TSIType[SolutionNode] = {
    implicit val x0: TSNamedType[SolutionNode] = TSType.external("ISolutionNode")
    implicit val x1: TSType[Applicability]     = Applicability.tsType

    TSType.fromCaseClass
  }

}

trait SolutionRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  private type DbSolutionNode = (Int, Int, Int, String, Applicability, Seq[SolutionNodeSubText], Option[Int])

  private def dbSolNode2FlatSolutionNode(node: DbSolutionNode): FlatSolutionNode = node match {
    case (_, id, childIndex, text, applicability, subTexts, parentId) => FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId)
  }

  private def flatSolutionNode2DbSolNode(exerciseId: Int, flatSolutionNode: FlatSolutionNode): DbSolutionNode = flatSolutionNode match {
    case FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId) => (exerciseId, id, childIndex, text, applicability, subTexts, parentId)
  }

  protected val sampleSolutionNodesTQ = TableQuery[SampleSolutionNodesTable]
  protected val userSolutionNodesTQ   = TableQuery[UserSolutionNodesTable]

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(sampleSolutionNodesTQ.filter { sol => sol.exerciseId === exerciseId }.result)
  } yield nodeTuples.map(dbSolNode2FlatSolutionNode)

  def futureInsertSampleSolutionForExercise(exerciseId: Int, sampleSolution: Seq[FlatSolutionNode]): Future[Option[Int]] =
    db.run(sampleSolutionNodesTQ ++= sampleSolution.map(flatSolutionNode2DbSolNode(exerciseId, _)))

  def futureUserSolutionForExercise(username: String, exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(userSolutionNodesTQ.filter { sol => sol.username === username && sol.exerciseId === exerciseId }.result)
  } yield nodeTuples.map((node) => dbSolNode2FlatSolutionNode(node._2))

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = for {
    lineCount <- db.run(userSolutionNodesTQ.filter { sol => sol.username === username && sol.exerciseId === exerciseId }.length.result)
  } yield lineCount > 0

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = db.run(userSolutionNodesTQ.filter { _.exerciseId === exerciseId }.map(_.username).result)

  def futureDeleteUserSolution(exerciseId: Int, username: String): Future[Unit] = for {
    _ <- db.run(userSolutionNodesTQ.filter { sol => sol.username === username && sol.exerciseId === exerciseId }.delete)
  } yield ()

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[FlatSolutionNode]): Future[Option[Int]] =
    db.run(userSolutionNodesTQ ++= userSolution.map(node => (username, flatSolutionNode2DbSolNode(exerciseId, node))))

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_entries") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def childIndex = column[Int]("child_index")

    def parentId = column[Option[Int]]("parent_id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def subTexts = column[Seq[SolutionNodeSubText]]("sub_texts")

    // noinspection ScalaUnusedSymbol
    def exerciseFk =
      foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

  }

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[DbSolutionNode](tag, "sample") {

    def pk = primaryKey("sample_solutions_pk", (exerciseId, id))

    override def * = (exerciseId, id, childIndex, text, applicability, subTexts, parentId)

  }

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[(String, DbSolutionNode)](tag, "user") {

    def username = column[String]("username")

    def pk = primaryKey("user_solution_pk", (username, exerciseId, id))

    // noinspection ScalaUnusedSymbol
    def userFk = foreignKey("user_solution_user_fk", username, usersTQ)(_.username, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (username, (exerciseId, id, childIndex, text, applicability, subTexts, parentId)).shaped

  }

}
