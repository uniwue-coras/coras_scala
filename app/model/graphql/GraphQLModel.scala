package model.graphql

import model._
import play.api.libs.json.JsValue
import sangria.execution.UserFacingError
import sangria.schema._

import javax.inject.Inject
import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success, Try}

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

final case class GraphQLContext(
  tableDefs: TableDefs,
  user: Option[User]
) {

  def resolveAdmin: Try[Admin] = user match {
    case Some(User(_, _, rights, _)) if rights == Rights.Admin => Success(new Admin())
    case _                                                     => Failure(UserFacingGraphQLError("User is not logged in or has insufficient rights!"))
  }

}

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments with JwtHelpers {

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(ExerciseGraphQLModel.queryType), resolve = _.ctx.tableDefs.futureAllExercises),
      Field(
        "exercise",
        OptionType(ExerciseGraphQLModel.queryType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureExerciseById(context.arg(exerciseIdArg))
      ),
      Field("adminQueries", Admin.queryType, resolve = _.ctx.resolveAdmin)
    )
  )

  // Mutations

  private val mutationType = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      Field(
        "adminMutations",
        Admin.mutationType,
        resolve = _.ctx.resolveAdmin
      ),
      Field(
        "exerciseMutations",
        OptionType(ExerciseGraphQLModel.mutationsType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureExerciseById(context.arg(exerciseIdArg))
      )
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
