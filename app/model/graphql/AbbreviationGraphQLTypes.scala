package model.graphql

import model.Abbreviation
import model.graphql.GraphQLArguments.abbreviationInputArgument
import sangria.macros.derive.deriveObjectType
import sangria.schema.{BooleanType, Field, ObjectType, fields}

import scala.annotation.unused
import scala.concurrent.ExecutionContext

object AbbreviationGraphQLTypes extends GraphQLBasics {

  @unused implicit val ec: ExecutionContext = ExecutionContext.global

  val queryType: ObjectType[Unit, Abbreviation] = deriveObjectType()

  private val resolveEdit: Resolver[Abbreviation, Abbreviation] = context => {
    val Abbreviation(newAbbreviation, newWord) = context.arg(abbreviationInputArgument)

    for {
      updated <- context.ctx.tableDefs.futureUpdateAbbreviation(context.value.abbreviation, newAbbreviation, newWord)
      _       <- futureFromBool(updated, UserFacingGraphQLError("Couldn't update abbreviation!"))
    } yield Abbreviation(newAbbreviation, newWord)
  }

  private val resolveDelete: Resolver[Abbreviation, Boolean] = context => context.ctx.tableDefs.futureDeleteAbbreviation(context.value.abbreviation)

  val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", BooleanType, resolve = resolveDelete)
    )
  )

}
