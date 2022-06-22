package model

import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.play.json.compat.json2bson._

import scala.concurrent.Future

final case class Exercise(
  id: Int,
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNode]
)

trait MongoExerciseRepository extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val exerciseFormat: OFormat[Exercise] = {
    implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

    Json.format
  }

  private def futureExercisesCollection: Future[BSONCollection] = futureCollection("exercises")

  def futureAllExercises: Future[Seq[Exercise]] = for {
    exercisesCollection <- futureExercisesCollection
    allExercises        <- exercisesCollection.find(BSONDocument.empty).cursor[Exercise]().collect[Seq]()
  } yield allExercises

  def futureExerciseById(exerciseId: Int): Future[Option[Exercise]] = for {
    exercisesCollection <- futureExercisesCollection
    maybeExercise       <- exercisesCollection.find(BSONDocument("id" -> exerciseId)).one[Exercise]
  } yield maybeExercise

  def futureInsertExercise(exercise: Exercise): Future[Boolean] = for {
    exercisesCollection <- futureExercisesCollection
    insertResult        <- exercisesCollection.insert.one(exercise)
  } yield insertResult.n == 1

  def futureMaxExerciseId: Future[Option[Int]] = for {
    exercisesCollection <- futureExercisesCollection
    maybeExercise       <- exercisesCollection.find(BSONDocument.empty).sort(BSONDocument("id" -> -1)).one[Exercise]
  } yield maybeExercise.map(_.id)

}
