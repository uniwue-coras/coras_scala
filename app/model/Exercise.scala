package model

import de.uniwue.ls6.corasModel.ExportedExercise

import scala.concurrent.{ExecutionContext, Future}

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNodeInput]
)

final case class Exercise(
  id: Int,
  title: String,
  text: String
) extends NodeExportable[ExportedExercise] {

  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = for {
    sampleSolutionNodes <- tableDefs.futureSampleSolutionForExercise(id)

    exportedSampleSolutionNodes = sampleSolutionNodes.map { _.exportData }

    userSolutionNodes <- tableDefs.futureUserSolutionsForExercise(id)

    exportedUserSolutions <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

  } yield ExportedExercise(id, title, text, exportedSampleSolutionNodes, exportedUserSolutions)

}

trait ExerciseRepository {
  self: TableDefs =>

  import profile.api._

  protected val exercisesTQ = TableQuery[ExercisesTable]

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureMaybeExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter { _.id === id }.result.headOption)

  protected class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {
    def id    = column[Int]("id", O.PrimaryKey, O.AutoInc)
    def title = column[String]("title", O.Unique)
    def text  = column[String]("text")

    override def * = (id, title, text) <> (Exercise.tupled, Exercise.unapply)
  }

}
