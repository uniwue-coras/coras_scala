package model.graphql

import model._
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.concurrent.{ExecutionContext, Future}

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

@deprecated()
object Mutations extends JwtHelpers {

  def handleChangePassword(tableDefs: TableDefs, oldPassword: String, newPassword: String)(implicit ec: ExecutionContext): Future[Boolean] = ???

}
