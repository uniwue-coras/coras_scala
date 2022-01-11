package model.graphql

import com.github.t3hnar.bcrypt._
import model.{Exercise, Rights, TableDefs, User}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

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

  def handleRegister(tableDefs: TableDefs, registerInput: RegisterInput)(implicit ec: ExecutionContext): Future[String] = registerInput match {
    case RegisterInput(username, password, _) if registerInput.isValid =>
      tableDefs
        .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student, None))
        .transformWith {
          case Success(true) => Future.successful(username)
          case _             => Future.failed(UserFacingGraphQLError("Could not insert user!"))
        }

    case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
  }

  def handleLogin(tableDefs: TableDefs, loginInput: LoginInput)(implicit ec: ExecutionContext): Future[LoginResult] = loginInput match {
    case LoginInput(username, password) =>
      tableDefs
        .futureMaybeUserByName(username)
        .transform {
          case Success(Some(User(username, Some(pwHash), rights, maybeName))) if password.isBcryptedBounded(pwHash) =>
            // check pw...

            val loginResult = LoginResult(username = username, name = maybeName, rights = rights, jwt = "1234" /* FIXME: generate! ???*/ )

            Success(loginResult)

          case _ => Failure(UserFacingGraphQLError("Invalid combination of username and password!"))
        }
  }

  def handleChangePassword(tableDefs: TableDefs, changePasswordInput: ChangePasswordInput)(implicit ec: ExecutionContext): Future[Boolean] = ???

  def handleExercise(tableDefs: TableDefs, exerciseId: Int)(implicit ec: ExecutionContext): Future[Option[Exercise]] = ???

}
