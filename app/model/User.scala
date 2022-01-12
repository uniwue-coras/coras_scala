package model

import enumeratum.{EnumEntry, PlayEnum}
import play.api.db.slick.HasDatabaseConfigProvider
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType
import slick.jdbc.JdbcProfile
import slick.lifted.ProvenShape

import scala.concurrent.{ExecutionContext, Future}

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  override def values: IndexedSeq[Rights] = findValues

  // Values

  case object Student extends Rights

  case object Corrector extends Rights

  case object Admin extends Rights

  // GraphQL type

  val graphQLType: EnumType[Rights] = deriveEnumType()

}

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights,
  maybeName: Option[String]
)

trait UserRepository {
  self: HasDatabaseConfigProvider[JdbcProfile] =>

  import profile.api._

  private val usersTQ = TableQuery[UsersTable]

  implicit val ec: ExecutionContext

  private val rightsType: BaseColumnType[Rights] = MappedColumnType.base[Rights, String](
    _.entryName.toLowerCase,
    Rights.lowerCaseNamesToValuesMap
  )

  def futureMaybeUserByName(username: String): Future[Option[User]] = db.run(usersTQ.filter(_.username === username).result.headOption)

  def futureInsertUser(user: User): Future[Boolean] = db.run(usersTQ += user).map(_ == 1)

  private class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    private implicit val x: BaseColumnType[Rights] = rightsType

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights")

    def maybeName = column[Option[String]]("name")

    override def * : ProvenShape[User] = (username, maybePasswordHash, rights, maybeName) <> (User.tupled, User.unapply)

  }

}
