package model

import scala.concurrent.Future

final case class Exercise(
  id: Int,
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNode]
)

trait ExerciseRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureMaybeExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter(_.id === id).result.headOption)

  def futureInsertExercise(title: String, text: String, sampleSolution: Seq[SolutionNode]): Future[Int] = db.run(
    exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text, sampleSolution)
  )

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def text = column[String]("text")

    def sampleSolution = column[Seq[SolutionNode]]("sample_solution_json")

    override def * = (id, title, text, sampleSolution) <> (Exercise.tupled, Exercise.unapply)
  }

}
