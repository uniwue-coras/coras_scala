package model

import scala.concurrent.Future

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights = Rights.Student
)

trait UserRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected val usersTQ = TableQuery[UsersTable]

  private def userByUsername(username: String): Query[UsersTable, User, Seq] = usersTQ.filter(_.username === username)

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run(userByUsername(username).result.headOption)

  def futureInsertUser(user: User): Future[String] = db.run(usersTQ.returning(usersTQ.map(_.username)) += user)

  def futureUpdateRightsForUser(username: String, rights: Rights): Future[Boolean] = for {
    lineCount <- db.run(userByUsername(username).map(_.rights).update(rights))
  } yield lineCount == 1

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Boolean] = for {
    lineCount <- db.run(userByUsername(username).map(_.maybePasswordHash).update(newPasswordHash))
  } yield lineCount == 1

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights", O.Default(Rights.Student))

    override def * = (username, maybePasswordHash, rights) <> (User.tupled, User.unapply)

  }

}
