package model

import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.play.json.compat.json2bson._

import scala.concurrent.Future

final case class UserSolution(
  username: String,
  exerciseId: Int,
  solution: Seq[SolutionNode]
)

trait MongoUserSolutionRepository extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val mongoUserSolutionJsonFormat: OFormat[UserSolution] = {
    implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat
    Json.format
  }

  private def futureUserSolutionsCollection: Future[BSONCollection] = futureCollection("userSolutions")

  def futureUserSolutionForExercise(exerciseId: Int, username: String): Future[Option[UserSolution]] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    maybeUserSolution <- userSolutionsCollection
      .find(BSONDocument("exerciseId" -> exerciseId, "username" -> username))
      .one[UserSolution]
  } yield maybeUserSolution

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    userNameFields <- userSolutionsCollection
      .find(BSONDocument("exerciseId" -> exerciseId), Some(BSONDocument("username" -> 1)))
      .cursor[UserNameExtractor]()
      .collect[Seq]()
  } yield userNameFields.map(_.username)

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    solutionCount           <- userSolutionsCollection.count(Some(BSONDocument("exerciseId" -> exerciseId, "username" -> username)))
  } yield solutionCount > 0

  def futureInsertCompleteUserSolution(solution: UserSolution): Future[Boolean] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    insertResult            <- userSolutionsCollection.insert.one(solution)
  } yield insertResult.n == 1

  def futureDeleteUserSolution(exerciseId: Int, username: String): Future[Unit] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    _                       <- userSolutionsCollection.delete.one(BSONDocument("exerciseId" -> exerciseId, "username" -> username))
  } yield ()

}
