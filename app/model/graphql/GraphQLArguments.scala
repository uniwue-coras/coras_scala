package model.graphql

import model._
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

import scala.annotation.unused

object GraphQLArguments extends JsonFormats {

  val exerciseIdArg: Argument[Int]                     = Argument("exerciseId", IntType)
  val userSolutionNodeIdArgument: Argument[Int]        = Argument("userSolutionNodeId", IntType)
  val sampleSolutionNodeIdArgument: Argument[Int]      = Argument("sampleSolutionNodeId", IntType)
  val annotationIdArgument: Argument[Int]              = Argument("annotationId", IntType)
  val maybeAnnotationIdArgument: Argument[Option[Int]] = Argument("maybeAnnotationId", OptionInputType(IntType))
  val groupIdArgument: Argument[Int]                   = Argument("groupId", IntType)
  val pointsArgument: Argument[Int]                    = Argument("points", IntType)

  val usernameArg: Argument[String]          = Argument("username", StringType)
  val oldPasswordArg: Argument[String]       = Argument("oldPassword", StringType)
  val passwordArg: Argument[String]          = Argument("password", StringType)
  val passwordRepeatArg: Argument[String]    = Argument("passwordRepeat", StringType)
  val ltiUuidArgument: Argument[String]      = Argument("ltiUuid", StringType)
  val wordArgument: Argument[String]         = Argument("word", StringType)
  val abbreviationArgument: Argument[String] = Argument("abbreviation", StringType)
  val commentArgument: Argument[String]      = Argument("comment", StringType)
  val uuidArgument: Argument[String]         = Argument("uuid", StringType)

  val newRightsArg: Argument[Rights] = Argument("newRights", Rights.graphQLType)

  val annotationArgument: Argument[AnnotationInput] = {
    implicit val x0: OFormat[AnnotationInput] = annotationInputJsonFormat

    Argument("annotation", AnnotationGraphQLTypes.inputType)
  }

  val exerciseInputArg: Argument[ExerciseInput] = {
    implicit val x0: OFormat[ExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", ExerciseGraphQLTypes.graphQLExerciseInputType)
  }

  val userSolutionInputArg: Argument[UserSolutionInput] = {
    implicit val x0: OFormat[UserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", UserSolutionGraphQLTypes.inputType)
  }

  val relatedWordInputArgument: Argument[RelatedWordInput] = {
    implicit val x0: OFormat[RelatedWordInput] = Json.format

    val inputType: InputObjectType[RelatedWordInput] = deriveInputObjectType()

    Argument("relatedWordInput", inputType)
  }

  val abbreviationInputArgument: Argument[Abbreviation] = {
    @unused implicit val x0: OFormat[Abbreviation] = Json.format

    val inputType: InputObjectType[Abbreviation] = deriveInputObjectType(
      InputObjectTypeName("AbbreviationInput")
    )

    Argument("abbreviationInput", inputType)
  }

}
