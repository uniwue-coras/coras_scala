package model.graphql

import model._
import model.userSolution.UserSolutionInput
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

trait GraphQLArguments extends JsonFormats:

  val exerciseIdArg: Argument[Int]                = Argument("exerciseId", IntType)
  val userSolutionNodeIdArgument: Argument[Int]   = Argument("userSolutionNodeId", IntType)
  val sampleSolutionNodeIdArgument: Argument[Int] = Argument("sampleSolutionNodeId", IntType)
  val annotationIdArgument: Argument[Int]         = Argument("annotationId", IntType)
  val groupIdArgument: Argument[Int]              = Argument("groupId", IntType)
  val pointsArgument: Argument[Int]               = Argument("points", IntType)

  val usernameArg: Argument[String]       = Argument("username", StringType)
  val oldPasswordArg: Argument[String]    = Argument("oldPassword", StringType)
  val passwordArg: Argument[String]       = Argument("password", StringType)
  val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)
  val ltiUuidArgument: Argument[String]   = Argument("ltiUuid", StringType)

  val abbreviationArgument: Argument[String] = Argument("abbreviation", StringType)
  val commentArgument: Argument[String]      = Argument("comment", StringType)
  val uuidArgument: Argument[String]         = Argument("uuid", StringType)
  val synonymArgument: Argument[String]      = Argument("synonym", StringType)

  val newRightsArg      = Argument[Rights]("newRights", Rights.graphQLType)
  val newCorrectnessArg = Argument[Correctness]("newCorrectness", Correctness.graphQLType)

  val maybeAnnotationIdArgument: Argument[Option[Int]]      = Argument("maybeAnnotationId", OptionInputType(IntType))
  val maybeSentenceNumberArgument: Argument[Option[String]] = Argument("maybeSentenceNumber", OptionInputType(IntType))

  val annotationArgument: Argument[AnnotationInput] = {
    implicit val x0: OFormat[AnnotationInput] = annotationInputJsonFormat

    Argument("annotation", AnnotationInput.inputType)
  }

  val exerciseInputArg: Argument[ExerciseInput] = {
    implicit val x0: OFormat[ExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", ExerciseInput.inputType)
  }

  val userSolutionInputArg: Argument[UserSolutionInput] = {
    implicit val x0: OFormat[UserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", UserSolutionInput.inputType)
  }

  val relatedWordInputArgument: Argument[RelatedWordInput] = {
    implicit val x0: OFormat[RelatedWordInput] = Json.format

    val inputType = deriveInputObjectType[RelatedWordInput]()

    Argument("relatedWordInput", inputType)
  }

  val abbreviationInputArgument: Argument[Abbreviation] = {
    implicit val x0: OFormat[Abbreviation] = Json.format

    val inputType = deriveInputObjectType[Abbreviation](
      InputObjectTypeName("AbbreviationInput")
    )

    Argument("abbreviationInput", inputType)
  }

  val paragraphSynonymInputArgument: Argument[ParagraphSynonym] = {
    implicit val x0: OFormat[ParagraphSynonym] = Json.format

    val inputType = deriveInputObjectType[ParagraphSynonym](
      InputObjectTypeName("ParagraphSynonymInput")
    )

    Argument("paragraphSynonymInput", inputType)
  }

  val paragraphSynonymIdentifierInputArgument: Argument[ParagraphSynonymIdentifier] = {
    implicit val x0: OFormat[ParagraphSynonymIdentifier] = Json.format

    val inputType = deriveInputObjectType[ParagraphSynonymIdentifier](
      InputObjectTypeName("ParagraphSynonymIdentifierInput")
    )

    Argument("paragraphSynonymIdentifierInput", inputType)
  }
