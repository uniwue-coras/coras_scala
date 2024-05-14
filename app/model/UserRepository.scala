package model

import slick.jdbc.JdbcType

import scala.concurrent.Future

trait UserRepository {
  self: TableDefs =>

  import profile.api._

  private implicit val rightsType: JdbcType[Rights] = MappedColumnType.base[Rights, String](_.entryName, Rights.withNameInsensitive)

  private object usersTQ extends TableQuery[UsersTable](new UsersTable(_)) {
    def byUsername(username: String): Query[UsersTable, User, Seq] = this.filter { _.username === username }
  }

  def futureAllUsers: Future[Seq[User]] = db.run { usersTQ.result }

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run { usersTQ.byUsername(username).result.headOption }

  def futureInsertUser(user: User): Future[Unit] = for {
    _ <- db.run { usersTQ += user }
  } yield ()

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Unit] = for {
    _ <- db.run { usersTQ.byUsername(username).map { _.maybePasswordHash } update newPasswordHash }
  } yield ()

  def futureUpdateUserRights(username: String, newRights: Rights): Future[Unit] = for {
    _ <- db.run { usersTQ.byUsername(username).map { _.rights } update newRights }
  } yield ()

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users") {
    def username          = column[String]("username", O.PrimaryKey)
    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")
    def rights            = column[Rights]("rights", O.Default(Rights.Student))

    override def * = (username, maybePasswordHash, rights).mapTo[User]
  }
}
