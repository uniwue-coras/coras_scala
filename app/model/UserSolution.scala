package model

import com.scalatsi.{TSIType, TSType}
import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.play.json.compat.json2bson._

import scala.concurrent.Future

final case class UserSolution(
  username: String,
  exerciseId: Int,
  solution: Seq[SolutionNode]
)

final case class UserSolutionInput(
  maybeUsername: Option[String],
  solution: Seq[SolutionNode]
)

object UserSolutionInput {

  private implicit val solutionNodeJsonFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

  val userSolutionInputJsonFormat: OFormat[UserSolutionInput] = Json.format

  val userSolutionJsonFormat: OFormat[UserSolution] = Json.format

  val tsType: TSIType[UserSolutionInput] = {
    implicit val x0: TSIType[SolutionNode] = SolutionNode.tsType

    TSType.fromCaseClass
  }

}

private final case class UserNameExtractor(username: String)

trait MongoUserSolutionRepository extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val mongoUserSolutionJsonFormat: OFormat[UserSolution] = UserSolutionInput.userSolutionJsonFormat

  private def futureUserSolutionsCollection = futureCollection("userSolutions")

  def futureUserSolutionForExercise(exerciseId: Int, username: String): Future[Option[UserSolution]] = for {
    userSolutionsCollection <- futureUserSolutionsCollection
    maybeUserSolution <- userSolutionsCollection
      .find(BSONDocument("exerciseId" -> exerciseId, "username" -> username))
      .one[UserSolution]
  } yield maybeUserSolution

  private implicit val userNameExtractorJsonFormat: OFormat[UserNameExtractor] = Json.format

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

}
