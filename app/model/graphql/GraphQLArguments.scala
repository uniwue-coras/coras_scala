package model.graphql

import model.matching.NodeMatchingResult
import model.{Applicability, FlatSolutionNode, SolutionNodeSubText}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

final case class GraphQLExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNode]
)

final case class GraphQLUserSolutionInput(
  maybeUsername: Option[String],
  solution: Seq[FlatSolutionNode]
)

final case class GraphQLCorrectionInput(
  username: String,
  @deprecated()
  correctionAsJson: String
)

trait GraphQLArguments {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

  val usernameArg: Argument[String] = Argument("username", StringType)

  val oldPasswordArg: Argument[String] = Argument("oldPassword", StringType)

  val passwordArg: Argument[String] = Argument("password", StringType)

  val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)

  val ltiUuidArgument: Argument[String] = Argument("ltiUuid", StringType)

  private val flatSolutionNodeInputType: InputObjectType[FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability]              = Applicability.graphQLType
    implicit val x1: InputObjectType[SolutionNodeSubText] = deriveInputObjectType(InputObjectTypeName("SolutionNodeSubTextInput"))

    deriveInputObjectType[FlatSolutionNode](InputObjectTypeName("FlatSolutionNodeInput"))
  }

  private val graphQLExerciseInputFormat: OFormat[GraphQLExerciseInput] = {
    implicit val x0: OFormat[FlatSolutionNode] = NodeMatchingResult.flatSolutionNodeJsonFormat

    Json.format
  }

  private val graphQLUserSolutionInputFormat: OFormat[GraphQLUserSolutionInput] = {
    implicit val x0: OFormat[FlatSolutionNode] = NodeMatchingResult.flatSolutionNodeJsonFormat

    Json.format
  }

  val exerciseInputArg: Argument[GraphQLExerciseInput] = {
    implicit val x1: OFormat[GraphQLExerciseInput]     = graphQLExerciseInputFormat
    implicit val x2: InputObjectType[FlatSolutionNode] = flatSolutionNodeInputType

    Argument("exerciseInput", deriveInputObjectType[GraphQLExerciseInput]())
  }

  val userSolutionInputArg: Argument[GraphQLUserSolutionInput] = {
    implicit val x1: OFormat[GraphQLUserSolutionInput] = graphQLUserSolutionInputFormat
    implicit val x2: InputObjectType[FlatSolutionNode] = flatSolutionNodeInputType

    Argument("userSolution", deriveInputObjectType[GraphQLUserSolutionInput]())
  }

  val correctionInputArg: Argument[GraphQLCorrectionInput] = {
    implicit val x: OFormat[GraphQLCorrectionInput] = Json.format

    Argument("correctionInput", deriveInputObjectType[GraphQLCorrectionInput]())
  }

}
