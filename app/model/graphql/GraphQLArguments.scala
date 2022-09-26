package model.graphql

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

  // Json formats

  private val flatSolutionNodeJsonFormat: OFormat[FlatSolutionNode] = {
    implicit val solutionEntrySubTextFormat: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

  private val graphQLExerciseInputFormat: OFormat[GraphQLExerciseInput] = {
    implicit val x0: OFormat[FlatSolutionNode] = flatSolutionNodeJsonFormat

    Json.format
  }

  private val graphQLUserSolutionInputFormat: OFormat[GraphQLUserSolutionInput] = {
    implicit val x0: OFormat[FlatSolutionNode] = flatSolutionNodeJsonFormat

    Json.format
  }

  // Input object types

  private val flatSolutionNodeInputType: InputObjectType[FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability]              = Applicability.graphQLType
    implicit val x1: InputObjectType[SolutionNodeSubText] = deriveInputObjectType(InputObjectTypeName("SolutionNodeSubTextInput"))

    deriveInputObjectType[FlatSolutionNode](InputObjectTypeName("FlatSolutionNodeInput"))
  }

  private val graphQLExerciseInputType: InputObjectType[GraphQLExerciseInput] = {
    implicit val x0: InputObjectType[FlatSolutionNode] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLExerciseInput]()
  }

  private val graphQLUserSolutionInputType: InputObjectType[GraphQLUserSolutionInput] = {
    implicit val x0: InputObjectType[FlatSolutionNode] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLUserSolutionInput]()
  }

  // Arguments

  val exerciseInputArg: Argument[GraphQLExerciseInput] = {
    implicit val x1: OFormat[GraphQLExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", graphQLExerciseInputType)
  }

  val userSolutionInputArg: Argument[GraphQLUserSolutionInput] = {
    implicit val x1: OFormat[GraphQLUserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", graphQLUserSolutionInputType)
  }

  val correctionInputArg: Argument[GraphQLCorrectionInput] = {
    implicit val x: OFormat[GraphQLCorrectionInput] = Json.format

    Argument("correctionInput", deriveInputObjectType[GraphQLCorrectionInput]())
  }

}
