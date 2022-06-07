package model

import model.graphql.{GraphQLArguments, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, fields}

case class UserSolution(
  exerciseId: Int,
  username: String
)

object UserSolution extends GraphQLArguments {

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field(
        "saveMatch",
        BooleanType,
        arguments = sampleSolutionNodeIdArg :: learnerSolutionNodeIdArg :: Nil,
        resolve = context => {

          val sampleSolutionNodeId  = context.arg(sampleSolutionNodeIdArg)
          val learnerSolutionNodeId = context.arg(learnerSolutionNodeIdArg)

          println(sampleSolutionNodeId + " :: " + learnerSolutionNodeId)

          ???
        }
      ),
      Field("submitCorrection", BooleanType, arguments = entryCorrectionsArg :: Nil, resolve = _ => ???)
    )
  )

}
