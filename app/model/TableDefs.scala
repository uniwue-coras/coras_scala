package model

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.lifted.ProvenShape

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

trait TableTypes extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  protected val rightsType: BaseColumnType[Rights] = MappedColumnType.base[Rights, String](
    _.entryName.toLowerCase,
    Rights.lowerCaseNamesToValuesMap
  )

}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with TableTypes {

  import profile.api._

  private val usersTQ = TableQuery[UsersTable]

  private val exercisesTQ = TableQuery[ExercisesTable]

  def futureMaybeUserByName(username: String): Future[Option[User]] = db.run(usersTQ.filter(_.username === username).result.headOption)

  def futureInsertUser(user: User): Future[Boolean] = db.run(usersTQ += user).map(_ == 1)

  def futureAllExercises: Future[Seq[Exercise]] = db.run(exercisesTQ.result)

  def futureExerciseById(id: Int): Future[Option[Exercise]] = db.run(exercisesTQ.filter(_.id === id).result.headOption)

  private class UsersTable(tag: Tag) extends Table[User](tag, "users") {

    private implicit val x: BaseColumnType[Rights] = rightsType

    def username = column[String]("username", O.PrimaryKey)

    def maybePasswordHash = column[Option[String]]("maybe_pw_hash")

    def rights = column[Rights]("rights")

    def maybeName = column[Option[String]]("name")

    override def * : ProvenShape[User] = (username, maybePasswordHash, rights, maybeName) <> (User.tupled, User.unapply)

  }

  private class ExercisesTable(tag: Tag) extends Table[Exercise](tag, "exercises") {

    def id = column[Int]("id", O.PrimaryKey)

    def title = column[String]("title")

    def author = column[String]("author")

    def text = column[String]("text")

    override def * = (id, title, author, text) <> (Exercise.tupled, Exercise.unapply)

  }

}
