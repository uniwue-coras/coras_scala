package model.graphql

import com.github.t3hnar.bcrypt._
import model.{Rights, TableDefs, User}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

class Mutations @Inject() (tableDefs: TableDefs)(implicit ec: ExecutionContext) {

  def handleRegister(registerInput: RegisterInput): Future[String] = if (registerInput.isValid) {
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

  def handleLogin(loginInput: LoginInput): Future[String] = {
    val LoginInput(username, password) = loginInput

    println(username + " :: " + password)

    ???
  }

}
