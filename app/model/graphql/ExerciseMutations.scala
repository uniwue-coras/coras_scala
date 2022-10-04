package model.graphql

import model.{Exercise, FlatSolutionNodeInput}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema.{Argument, BooleanType, Field, InputObjectType, ObjectType, fields}

import scala.concurrent.Future

trait ExerciseMutations extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: scala.concurrent.ExecutionContext

  private val graphQLUserSolutionInputFormat: OFormat[GraphQLUserSolutionInput] = {
    implicit val x0: OFormat[FlatSolutionNodeInput] = flatSolutionNodeInputJsonFormat

    Json.format
  }

  private val graphQLUserSolutionInputType: InputObjectType[GraphQLUserSolutionInput] = {
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLUserSolutionInput]()
  }

  private val userSolutionInputArg: Argument[GraphQLUserSolutionInput] = {
    implicit val x1: OFormat[GraphQLUserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", graphQLUserSolutionInputType)
  }

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    val GraphQLUserSolutionInput(maybeUsername, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(maybeUsername.getOrElse(user.username), context.value.id, flatSolution)
    } yield true
  }

  private val resolveSubmitCorrection: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    val GraphQLCorrectionInput(username, correctionAsJson) = context.arg(correctionInputArg)

    for {
      correction /* :* SolutionNodeMatchingResult*/ <- Future.failed { new Exception("TODO: implement!") }
      _ /* oldCorrectionDeleted*/                   <- context.ctx.tableDefs.futureDeleteCorrection(context.value.id, username)
      inserted                                      <- context.ctx.tableDefs.futureInsertCorrection(context.value.id, username, correction)
    } yield true
  }

  val exerciseMutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("submitCorrection", BooleanType, arguments = correctionInputArg :: Nil, resolve = resolveSubmitCorrection)
    )
  )

}
