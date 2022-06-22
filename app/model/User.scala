package model

import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.play.json.compat.json2bson._

import scala.concurrent.Future

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights = Rights.Student
)

trait MongoUserRepository extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val userFormat: OFormat[User] = Json.format

  private def futureUsersCollection: Future[BSONCollection] = futureCollection("users")

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = for {
    usersCollection <- futureUsersCollection
    maybeUser       <- usersCollection.find(BSONDocument("username" -> username)).one[User]
  } yield maybeUser

  def futureInsertUser(user: User): Future[Boolean] = for {
    usersCollection <- futureUsersCollection
    insertResult    <- usersCollection.insert.one(user)
  } yield insertResult.n == 1

  def futureUpdatePassword(username: String, newPasswordHash: String): Future[Boolean] = for {
    usersCollection <- futureUsersCollection
    updateResult <- usersCollection.update.one(
      BSONDocument("username" -> username),
      BSONDocument("$set"     -> BSONDocument("maybePasswordHash" -> Some(newPasswordHash)))
    )
  } yield updateResult.n == 1

}
