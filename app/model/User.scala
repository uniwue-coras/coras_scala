package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

import scala.concurrent.Future

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  override def values: IndexedSeq[Rights] = findValues

  case object Student extends Rights

  case object Corrector extends Rights

  case object Admin extends Rights

  val graphQLType: EnumType[Rights] = deriveEnumType()

}

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights = Rights.Student
)

trait UserRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected object usersTQ extends TableQuery[UsersTable](new UsersTable(_)) {
    def byUsername(username: String): Query[UsersTable, User, Seq] = usersTQ.filter(_.username === username)
  }

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run(usersTQ.byUsername(username).result.headOption)

  def futureInsertUser(user: User): Future[String] = db.run(usersTQ.returning(usersTQ.map(_.username)) += user)

  def futureUpdateRightsForUser(username: String, rights: Rights): Future[Boolean] = for {
    lineCount <- db.run(usersTQ.byUsername(username).map(_.rights).update(rights))
  } yield lineCount == 1

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Boolean] = for {
    lineCount <- db.run(usersTQ.byUsername(username).map(_.maybePasswordHash).update(newPasswordHash))
  } yield lineCount == 1

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights", O.Default(Rights.Student))

    override def * = (username, maybePasswordHash, rights) <> (User.tupled, User.unapply)

  }

}
