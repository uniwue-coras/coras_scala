package model.graphql

import model._
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema._

final case class SubmitSolutionInput(
  username: Option[String],
  solution: Seq[FlatSolutionNodeInput]
)

trait GraphQLArguments {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

  val usernameArg: Argument[String] = Argument("username", StringType)

  val rightsArg: Argument[Rights] = Argument("rights", Rights.graphQLType)

  val prefixArg: Argument[String] = Argument("prefix", StringType)

  val solutionArg: Argument[SubmitSolutionInput] = {
    implicit val x: OFormat[SubmitSolutionInput] = {
      implicit val x: OFormat[FlatSolutionNodeInput] = FlatSolutionNode.inputJsonFormat

      Json.format
    }

    implicit val x1: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNode.inputType

    Argument[SubmitSolutionInput]("solution", deriveInputObjectType[SubmitSolutionInput]())
  }

  val nodeMatchInputArg: Argument[NodeMatchInput] = {
    implicit val x: OFormat[NodeMatchInput] = Json.format

    Argument("nodeMatchInput", deriveInputObjectType[NodeMatchInput]())
  }

}
