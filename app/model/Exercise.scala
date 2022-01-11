package model

import model.graphql.{GraphQLArguments, GraphQLContext}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

final case class Exercise(
  id: Int,
  title: String,
  text: String
)

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionEntryInput]
)

object Exercise extends GraphQLArguments {

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields(
      Field("sampleSolution", ListType(FlatSolutionEntry.queryType), resolve = _ => Seq(???)),
      Field("solutionForUser", ListType(ListType(FlatSolutionEntry.queryType)), arguments = usernameArg :: Nil, resolve = _ => Seq(Seq(???))),
      Field("solutionSubmitted", BooleanType, resolve = _ => ???),
      Field("allUsersWithSolution", ListType(StringType), resolve = _ => Seq(???))
    )
  )

  val mutationsType: ObjectType[GraphQLContext, Exercise] = ObjectType[GraphQLContext, Exercise](
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolutionForUser", BooleanType, arguments = usernameArg :: solutionArg :: Nil, resolve = _ => ???),
      Field("submitUserSolution", BooleanType, arguments = solutionArg :: Nil, resolve = _ => ???),
      Field("userSolutionMutations", UserSolution.mutationType, arguments = usernameArg :: Nil, resolve = _ => ???)
    )
  )

  val inputType: InputObjectType[ExerciseInput] = {
    implicit val x: InputObjectType[FlatSolutionEntryInput] = FlatSolutionEntry.inputType

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[ExerciseInput] = {
    implicit val x: OFormat[FlatSolutionEntryInput] = FlatSolutionEntry.inputJsonFormat

    Json.format
  }

}
