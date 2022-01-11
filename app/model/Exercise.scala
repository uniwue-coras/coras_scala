package model

import model.graphql.{GraphQLArguments, GraphQLContext}
import sangria.macros.derive.{AddFields, InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema._

final case class Exercise(
  id: Int,
  title: String,
  text: String
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
      Field("submitSolutionForUser", BooleanType, arguments = usernameArg :: solutionArg :: Nil, resolve = _ => false),
      Field("submitUserSolution", BooleanType, arguments = solutionArg :: Nil, resolve = _ => false)
    )
  )

  val inputType: InputObjectType[Exercise] = deriveInputObjectType(
    InputObjectTypeName("ExerciseInput")
  )

}
