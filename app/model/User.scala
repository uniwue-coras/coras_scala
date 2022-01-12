package model

import enumeratum.{EnumEntry, PlayEnum}
import model.graphql.UserFacingGraphQLError
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

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
  self: TableDefs =>

  import profile.api._

  protected val usersTQ = TableQuery[UsersTable]

  implicit val ec: ExecutionContext

  private implicit val rightsType: BaseColumnType[Rights] = MappedColumnType.base[Rights, String](
    _.entryName.toLowerCase,
    Rights.lowerCaseNamesToValuesMap
  )

  def futureMaybeUserByName(username: String): Future[Option[User]] = db.run(usersTQ.filter(_.username === username).result.headOption)

  def futureInsertUser(user: User): Future[String] = db
    .run(usersTQ.returning(usersTQ.map(_.username)) += user)
    .recoverWith(_ => Future.failed(UserFacingGraphQLError("Could not insert user!")))

  def futureUsersWithRights(rights: Rights): Future[Seq[String]] = db.run(usersTQ.filter(_.rights === rights).map(_.username).result)

  def futureUsersByUsernamePrefix(prefix: String): Future[Seq[String]] = db.run(usersTQ.filter(_.username.startsWith(prefix)).map(_.username).result)

  def futureUpdateUserRights(username: String, rights: Rights): Future[Boolean] =
    db.run(usersTQ.filter(_.username === username).map(_.rights).update(rights)).map(_ == 1)

  def futureUpdatePassword(username: String, newPasswordHash: String): Future[Boolean] =
    db.run(usersTQ.filter(_.username === username).map(_.maybePasswordHash).update(Some(newPasswordHash))).map(_ == 1)

  protected class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights")

    def maybeName = column[Option[String]]("name")

    override def * = (username, maybePasswordHash, rights, maybeName) <> (User.tupled, User.unapply)

  }

}
