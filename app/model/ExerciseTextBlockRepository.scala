package model

import scala.concurrent.Future
import scala.language.postfixOps

trait ExerciseTextBlockRepository {
  self: TableDefs =>

  import profile.api._

  protected val exerciseTextBlockEndsTQ = TableQuery[ExerciseTextBlockEndsTable]

  def futureExerciseTextBlockEnds(exerciseId: Int, blockId: Int): Future[Seq[String]] = db.run {
    exerciseTextBlockEndsTQ
      .filter { end => end.exerciseId === exerciseId && end.blockId === blockId }
      .map { _.text }
      .result
  }

  protected val exerciseTextBlocksTQ = TableQuery[ExerciseTextBlockTable]

  def futureSelectExerciseTextBlocksForExercise(exerciseId: Int): Future[Seq[ExerciseTextBlock]] =
    db.run { exerciseTextBlocksTQ filter { _.exerciseId === exerciseId } result }

  def futureSelectExerciseTextBlock(exerciseId: Int, id: Int): Future[Option[ExerciseTextBlock]] =
    db.run { exerciseTextBlocksTQ.filter { g => g.exerciseId === exerciseId && g.id === id }.result.headOption }

  def futureInsertTextBlock(exerciseId: Int, startText: String, ends: Seq[String]): Future[Int] = {
    val actions = for {
      mabyeMaxBlockId <- exerciseTextBlocksTQ.filter { _.exerciseId === exerciseId }.map { _.id }.max.result
      blockId = mabyeMaxBlockId map { _ + 1 } getOrElse 0
      _ <- exerciseTextBlocksTQ += ExerciseTextBlock(exerciseId, blockId, startText)
      _ <- exerciseTextBlockEndsTQ ++= ends.map { ExerciseTextBlockEnd(exerciseId, blockId, _) }
    } yield blockId

    db.run(actions.transactionally)
  }

  def futureUpdateExerciseTextBlock(exerciseId: Int, id: Int, startText: String, ends: Seq[String]): Future[Unit] = {
    val actions = for {
      _ <- exerciseTextBlocksTQ.filter { g => g.exerciseId === exerciseId && g.id === id }.delete
      _ <- exerciseTextBlocksTQ += ExerciseTextBlock(exerciseId, id, startText)
      _ <- exerciseTextBlockEndsTQ ++= ends.map { ExerciseTextBlockEnd(exerciseId, id, _) }
    } yield ()

    db.run(actions.transactionally)
  }

  def futureDeleteExerciseTextBlock(exerciseId: Int, groupId: Int): Future[Unit] = for {
    _ <- db.run { exerciseTextBlocksTQ filter { g => g.exerciseId === exerciseId && g.id === groupId } delete }
  } yield ()

  protected class ExerciseTextBlockTable(tag: Tag) extends Table[ExerciseTextBlock](tag, "exercise_text_blocks") {
    def exerciseId = column[Int]("exercise_id")
    def id         = column[Int]("id")
    def startText  = column[String]("start_text", O.Length(100))

    override def * = (exerciseId, id, startText).mapTo[ExerciseTextBlock]
  }

  protected class ExerciseTextBlockEndsTable(tag: Tag) extends Table[ExerciseTextBlockEnd](tag, "exercise_text_block_ends") {
    def exerciseId = column[Int]("exercise_id")
    def blockId    = column[Int]("block_id")
    def text       = column[String]("text", O.Length(50))

    override def * = (exerciseId, blockId, text).mapTo[ExerciseTextBlockEnd]
  }
}
