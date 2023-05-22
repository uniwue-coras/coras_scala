package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType
import slick.jdbc.JdbcType

import scala.concurrent.Future

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  case object Student   extends Rights
  case object Corrector extends Rights
  case object Admin     extends Rights

  override def values: IndexedSeq[Rights] = findValues

  val graphQLType: EnumType[Rights] = deriveEnumType()

}

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights = Rights.Student
)

trait UserRepository {
  self: TableDefs =>

  import profile.api._

  private implicit val rightsType: JdbcType[Rights] = MappedColumnType.base[Rights, String](_.entryName, Rights.withNameInsensitive)

  private val usersTQ = TableQuery[UsersTable]

  def futureMaybeUserByUsername(username: String): Future[Option[User]] = db.run(usersTQ.filter(_.username === username).result.headOption)

  def futureInsertUser(user: User): Future[String] = db.run(usersTQ.returning(usersTQ.map(_.username)) += user)

  def futureUpdatePasswordForUser(username: String, newPasswordHash: Some[String]): Future[Boolean] = for {
    lineCount <- db.run(usersTQ.filter(_.username === username).map(_.maybePasswordHash).update(newPasswordHash))
  } yield lineCount == 1

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users") {
    def username          = column[String]("username", O.PrimaryKey)
    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")
    private def rights    = column[Rights]("rights", O.Default(Rights.Student))

    override def * = (username, maybePasswordHash, rights) <> (User.tupled, User.unapply)
  }

}
