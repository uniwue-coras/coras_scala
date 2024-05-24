package model

import scala.concurrent.Future
import scala.language.postfixOps

trait ExerciseTextBlockRepository {
  self: TableDefs =>

  import profile.api._

  protected val exerciseTextBlocksTQ = TableQuery[ExerciseTextBlockTable]

  // private val nextGroupIdAction = exerciseTextBlocksTQ.map { _.groupId }.max.result

  def futureSelectExerciseTextGroupBlockForExercise(exerciseId: Int): Future[Seq[ExerciseTextBlockGroup]] = for {
    rows <- db.run { exerciseTextBlocksTQ filter { _.exerciseId === exerciseId } result }
    groups = rows
      .groupBy { case (exerciseId, groupId, _) => (exerciseId, groupId) }
      .map { case ((exerciseId, groupId), textBlocks) =>
        ExerciseTextBlockGroup(exerciseId, groupId, textBlocks.map { _._3 })
      }
      .toSeq
      .sortBy { g => (g.exerciseId, g.groupId) }
  } yield groups

  def futureSelectExerciseTextBlockGroup(exerciseId: Int, groupId: Int): Future[Option[ExerciseTextBlockGroup]] = for {
    contents <- db.run { exerciseTextBlocksTQ filter { g => g.exerciseId === exerciseId && g.groupId === groupId } map { _.content } result }
  } yield if (contents.isEmpty) None else Some(ExerciseTextBlockGroup(exerciseId, groupId, contents))

  def futureInsertTextBlockGroup(exerciseId: Int, contents: Seq[String]): Future[Int] = {
    val actions = for {
      mabyeMaxGroupId <- exerciseTextBlocksTQ.filter { _.exerciseId === exerciseId }.map { _.groupId }.max.result
      groupId = mabyeMaxGroupId map { _ + 1 } getOrElse 0
      _ <- exerciseTextBlocksTQ ++= contents.map { (exerciseId, groupId, _) }
    } yield groupId

    db.run(actions.transactionally)
  }

  def futureInsertExerciseTextBlockIntoGroup(exerciseId: Int, groupId: Int, content: String): Future[Unit] = for {
    _ <- db.run { exerciseTextBlocksTQ += (exerciseId, groupId, content) }
  } yield ()

  def futureUpdateExerciseTextBlockGroup(exerciseId: Int, groupId: Int, contents: Seq[String]): Future[Unit] = {
    val actions = for {
      _ <- exerciseTextBlocksTQ.filter { g => g.exerciseId === exerciseId && g.groupId === groupId }.delete
      _ <- exerciseTextBlocksTQ ++= contents.map { (exerciseId, groupId, _) }
    } yield ()

    db.run(actions.transactionally)
  }

  def futureDeleteExerciseTextBlockGroup(exerciseId: Int, groupId: Int): Future[Unit] = for {
    _ <- db.run { exerciseTextBlocksTQ filter { g => g.exerciseId === exerciseId && g.groupId === groupId } delete }
  } yield ()

  protected class ExerciseTextBlockTable(tag: Tag) extends Table[(Int, Int, String)](tag, "exercise_text_blocks") {
    def exerciseId = column[Int]("exercise_id")
    def groupId    = column[Int]("group_id")
    def content    = column[String]("content", O.Length(200))

    override def * = (exerciseId, groupId, content)
  }
}
