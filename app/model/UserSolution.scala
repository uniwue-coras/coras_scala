package model

import model.graphql.{GraphQLArguments, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, fields}

import scala.concurrent.ExecutionContext

case class UserSolution(
  exerciseId: Int,
  username: String
)

object UserSolution extends GraphQLArguments {

  implicit val ec: ExecutionContext = ExecutionContext.global

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field(
        "saveMatch",
        BooleanType,
        arguments = sampleSolutionNodeIdArg :: learnerSolutionNodeIdArg :: Nil,
        resolve = context =>
          context.ctx.tableDefs.futureInsertNodeMatch(
            context.value.username,
            context.value.exerciseId,
            context.arg(sampleSolutionNodeIdArg),
            context.arg(learnerSolutionNodeIdArg)
          )
      ),
      Field("submitCorrection", BooleanType, arguments = entryCorrectionsArg :: Nil, resolve = _ => ???)
    )
  )

}
