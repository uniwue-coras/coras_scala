package model

import com.scalatsi.{TSIType, TSType}
import model.graphql.{GraphQLArguments, GraphQLContext}
import play.api.libs.json.{Json, OFormat}
import sangria.schema.{BooleanType, Field, ObjectType, fields}

import scala.concurrent.ExecutionContext

final case class UserSolution(
  exerciseId: Int,
  username: String
)

final case class NodeMatchInput(
  matchId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  parentMatchId: Option[Int]
)

object UserSolution extends GraphQLArguments {

  implicit val ec: ExecutionContext = ExecutionContext.global

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field(
        "saveMatch",
        BooleanType,
        arguments = nodeMatchInputArg :: Nil,
        resolve = context =>
          context.arg(nodeMatchInputArg) match {
            case NodeMatchInput(matchId, sampleNodeId, userNodeId, parentMatchId) =>
              context.ctx.tableDefs.futureInsertNodeMatch(context.value.username, context.value.exerciseId, matchId, sampleNodeId, userNodeId, parentMatchId)
          }
      )
    )
  )

}

final case class NewUserSolutionInput(
  maybeUsername: Option[String],
  solution: Seq[SolutionNode]
)

object NewUserSolutionInput {

  val jsonFormat: OFormat[NewUserSolutionInput] = {
    implicit val x0: OFormat[SolutionNode] = SolutionNode.jsonFormat

    Json.format
  }

  val tsType: TSIType[NewUserSolutionInput] = {
    implicit val x0: TSIType[SolutionNode] = SolutionNode.tsType

    TSType.fromCaseClass
  }

}
