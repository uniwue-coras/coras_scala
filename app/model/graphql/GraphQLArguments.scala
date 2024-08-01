package model.graphql

import model._
import model.userSolution.UserSolutionInput
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

trait GraphQLArguments extends JsonFormats {

  val annotationIdArg  = Argument("annotationId", IntType)
  val blockIdArg       = Argument("blockId", IntType)
  val exerciseIdArg    = Argument("exerciseId", IntType)
  val groupIdArg       = Argument("groupId", IntType)
  val pointsArg        = Argument("points", IntType)
  val secondBlockIdArg = Argument("secondBlockId", IntType)
  val sampleNodeIdArg  = Argument("sampleSolutionNodeId", IntType)
  val userSolNodeIdArg = Argument("userSolutionNodeId", IntType)

  val abbreviationArgument     = Argument("abbreviation", StringType)
  val awaitedParagraphArgument = Argument("awaitedParagraph", StringType)
  val commentArgument          = Argument("comment", StringType)
  val explanationArgument      = Argument("explanation", StringType)
  val ltiUuidArgument          = Argument("ltiUuid", StringType)
  val oldPasswordArg           = Argument("oldPassword", StringType)
  val passwordArg              = Argument("password", StringType)
  val passwordRepeatArg        = Argument("passwordRepeat", StringType)
  val synonymArgument          = Argument("synonym", StringType)
  val textArgument             = Argument("text", StringType)
  val usernameArg              = Argument("username", StringType)
  val uuidArgument             = Argument("uuid", StringType)

  val newRightsArg      = Argument[Rights]("newRights", Rights.graphQLType)
  val newCorrectnessArg = Argument[Correctness]("newCorrectness", Correctness.graphQLType)

  val maybeAnnotationIdArgument: Argument[Option[Int]]      = Argument("maybeAnnotationId", OptionInputType(IntType))
  val maybeSentenceNumberArgument: Argument[Option[String]] = Argument("maybeSentenceNumber", OptionInputType(StringType))

  val annotationArgument: Argument[AnnotationInput] = {
    implicit val x0: OFormat[AnnotationInput] = annotationInputJsonFormat
    Argument("annotation", AnnotationInput.inputType)
  }

  val abbreviationInputArgument: Argument[Abbreviation] = {
    implicit val x0 = Json.format[Abbreviation]

    val inputType = deriveInputObjectType[Abbreviation](
      InputObjectTypeName("AbbreviationInput")
    )

    Argument("abbreviationInput", inputType)
  }

  val exerciseInputArg: Argument[ExerciseInput] = {
    implicit val x0: OFormat[ExerciseInput] = graphQLExerciseInputFormat
    Argument("exerciseInput", ExerciseInput.inputType)
  }

  val exerciseTextBlockInputArg = {
    implicit val x0 = Json.format[ExerciseTextBlockInput]
    Argument("textBlock", ExerciseTextBlockInput.inputType)
  }

  val paragraphCitationAnnotationInputArgument: Argument[ParagraphCitationAnnotationInput] = {
    implicit val jf: OFormat[ParagraphCitationAnnotationInput] = Json.format

    Argument("paragraphCitationAnnotation", ParagraphCitationAnnotationInput.inputType)
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
}
