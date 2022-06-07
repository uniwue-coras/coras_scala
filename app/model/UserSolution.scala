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
        resolve = context => {

          val UserSolution(exerciseId, username) = context.value;

          val sampleSolutionNodeId  = context.arg(sampleSolutionNodeIdArg)
          val learnerSolutionNodeId = context.arg(learnerSolutionNodeIdArg)

          println(sampleSolutionNodeId + " :: " + learnerSolutionNodeId)

          context.ctx.tableDefs.futureInsertNodeMatch(username,exerciseId, sampleSolutionNodeId, learnerSolutionNodeId).map(_ == 1)

        }
      ),
      Field("submitCorrection", BooleanType, arguments = entryCorrectionsArg :: Nil, resolve = _ => ???)
    )
  )

}
