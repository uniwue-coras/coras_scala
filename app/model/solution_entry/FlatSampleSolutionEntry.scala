package model.solution_entry

import model.{Applicability, TableDefs}

final case class FlatSampleSolutionEntry(
  exerciseId: Int,
  id: Int,
  text: String,
  applicability: Applicability,
  weight: Option[Int],
  priorityPoints: Option[Int],
  parentId: Option[Int]
)

trait FlatSampleSolutionEntryRepo {
  self: TableDefs =>

  import profile.api._

  protected val flatSampleSolutionEntriesTableTQ = TableQuery[FlatSampleSolutionEntriesTable]

  protected class FlatSampleSolutionEntriesTable(tag: Tag) extends Table[FlatSampleSolutionEntry](tag, "sample_solution_entries") {

    def exerciseId = column[Int]("exercise_id", O.PrimaryKey)

    def id = column[Int]("id", O.PrimaryKey)

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def weight = column[Option[Int]]("weight")

    def priorityPoints = column[Option[Int]]("priority_points")

    def parentId = column[Option[Int]]("parent_id")

    override def * =
      (exerciseId, id, text, applicability, weight, priorityPoints, parentId) <> (FlatSampleSolutionEntry.tupled, FlatSampleSolutionEntry.unapply)

  }

}
