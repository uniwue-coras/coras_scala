package model

import model.graphql.UserFacingGraphQLError

import scala.concurrent.{ExecutionContext, Future}

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights = Rights.Student
)

trait UserRepository {
  self: play.api.db.slick.HasDatabaseConfig[slick.jdbc.JdbcProfile] =>

  import MyPostgresProfile.api._

  private val usersTQ = TableQuery[UsersTable]

  private def userByUsername(username: String): Query[UsersTable, User, Seq] = usersTQ.filter(_.username === username)

  protected implicit val ec: ExecutionContext

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run(userByUsername(username).result.headOption)

  def futureInsertUser(user: User): Future[String] = db
    .run(usersTQ.returning(usersTQ.map(_.username)) += user)
    .recoverWith(_ => Future.failed(UserFacingGraphQLError("Could not insert user!")))

  def futureUpdateRightsForUser(username: String, rights: Rights): Future[Boolean] =
    db.run(userByUsername(username).map(_.rights).update(rights)).map(_ == 1)

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Boolean] = for {
    lineCount <- db.run(userByUsername(username).map(_.maybePasswordHash).update(newPasswordHash))
  } yield lineCount == 1

  private class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights")

    override def * = (username, maybePasswordHash, rights) <> (User.tupled, User.unapply)

  }

}
