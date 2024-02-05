package model

import scala.concurrent.Future
import slick.jdbc.JdbcType

trait UserRepository:
  self: TableDefs =>

  import profile.api._

  private implicit val rightsType: JdbcType[Rights] = MappedColumnType.base[Rights, String](_.entryName, Rights.withNameInsensitive)

  private object usersTQ extends TableQuery[UsersTable](new UsersTable(_)) {
    def byUsername(username: String): Query[UsersTable, User, Seq] = this.filter { _.username === username }
  }

  def futureAllUsers: Future[Seq[User]] = db.run(usersTQ.result)

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run { usersTQ.byUsername(username).result.headOption }

  def futureInsertUser(user: User): Future[Boolean] = for {
    rowCount <- db.run(usersTQ += user)
  } yield rowCount == 1

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Boolean] = for {
    lineCount <- db.run(usersTQ.byUsername(username).map(_.maybePasswordHash).update(newPasswordHash))
  } yield lineCount == 1

  def futureUpdateUserRights(username: String, newRights: Rights): Future[Boolean] = for {
    rowCount <- db.run(usersTQ.byUsername(username).map(_.rights).update(newRights))
  } yield rowCount == 1

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users"):
    def username          = column[String]("username", O.PrimaryKey)
    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")
    def rights            = column[Rights]("rights", O.Default(Rights.Student))

    override def * = (username, maybePasswordHash, rights).mapTo[User]
