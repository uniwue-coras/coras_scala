package model

import scala.concurrent.Future

final case class Exercise(
  id: Int,
  title: String,
  text: String
)

trait ExerciseRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureMaybeExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter(_.id === id).result.headOption)

  def futureInsertExercise(title: String, text: String): Future[Int] = db.run(
    exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text)
  )

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def text = column[String]("text")

    override def * = (id, title, text) <> (Exercise.tupled, Exercise.unapply)

  }

}
