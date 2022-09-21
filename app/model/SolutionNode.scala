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

protected final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  parentId: Option[Int]
)

trait SampleSolutionRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected val sampleSolutionsTQ = TableQuery[SampleSolutionsTable]

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(sampleSolutionsTQ.filter { sol => sol.exerciseId === exerciseId }.result)

    nodes = nodeTuples.map { case FlatSampleSolutionNode(_, id, childIndex, text, applicability, subTexts, parentId) =>
      FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId)
    }
  } yield nodes

  def futureInsertSampleSolutionForExercise(exerciseId: Int, sampleSolution: Seq[FlatSolutionNode]): Future[Option[Int]] = {
    val solutionNodes = sampleSolution.map { case FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId) =>
      FlatSampleSolutionNode(exerciseId, id, childIndex, text, applicability, subTexts, parentId)
    }

    db.run(sampleSolutionsTQ ++= solutionNodes)
  }

  protected class SampleSolutionsTable(tag: Tag) extends Table[FlatSampleSolutionNode](tag, "sample_solution_entries") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def childIndex = column[Int]("child_index")

    def parentId = column[Option[Int]]("parent_id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def subTexts = column[Seq[SolutionNodeSubText]]("sub_texts")

    def pk = primaryKey("sample_solutions_pk", (exerciseId, id))

    def exerciseFk =
      foreignKey("sample_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (exerciseId, id, childIndex, text, applicability, subTexts, parentId) <> (FlatSampleSolutionNode.tupled, FlatSampleSolutionNode.unapply)

  }

}
