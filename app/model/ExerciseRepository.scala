package model

import scala.concurrent.Future

trait ExerciseRepository:
  self: TableDefs =>

  import profile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run { exercisesTQ.result }

  def futureMaybeExerciseById(id: Int): Future[Option[Exercise]] = db.run { exercisesTQ.filter { _.id === id }.result.headOption }

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises"):
    def id    = column[Int]("id", O.PrimaryKey, O.AutoInc)
    def title = column[String]("title", O.Unique)

    override def * = (id, title).mapTo[Exercise]
