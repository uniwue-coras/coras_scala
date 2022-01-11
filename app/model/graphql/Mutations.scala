package model.graphql

import com.github.t3hnar.bcrypt._
import model.{Exercise, Rights, TableDefs, User}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

final case class LoginResult(
  username: String,
  name: Option[String],
  rights: Rights,
  jwt: String
)

object LoginResult {
  val queryType: ObjectType[GraphQLContext, LoginResult] = {
    implicit val rightsType: EnumType[Rights] = Rights.graphQLType

    deriveObjectType()
  }
}

object Mutations {

  def handleRegister(tableDefs: TableDefs, registerInput: RegisterInput)(implicit ec: ExecutionContext): Future[String] = if (registerInput.isValid) {
    val RegisterInput(username, password, _) = registerInput

    tableDefs
      .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student, None))
      .transformWith {
        case Success(true) => Future.successful(username)
        case _             => Future.failed(RegisterError("Could not insert user!"))
      }

  } else {
    Future.failed(RegisterError("Passwords do not match!"))
  }

  def handleLogin(tableDefs: TableDefs, loginInput: LoginInput)(implicit ec: ExecutionContext): Future[LoginResult] = {
    val LoginInput(username, password) = loginInput

    println(username + " :: " + password)

    ???
  }

  def handleChangePassword(tableDefs: TableDefs, changePasswordInput: ChangePasswordInput)(implicit ec: ExecutionContext): Future[Boolean] = ???

  def handleExercise(tableDefs: TableDefs, exerciseId: Int)(implicit ec: ExecutionContext): Future[Option[Exercise]] = ???

}
