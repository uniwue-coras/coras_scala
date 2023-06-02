package model.graphql

import model.graphql.GraphQLArguments.wordArgument
import model.{RelatedWord, RelatedWordsGroup}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

import scala.annotation.unused

object RelatedWordGraphQLTypes extends GraphQLBasics {

  private val inputType: InputObjectType[RelatedWord] = deriveInputObjectType(
    InputObjectTypeName("RelatedWordInput")
  )

  private val newValueArgument = {
    implicit val x0: OFormat[RelatedWord] = Json.format

    Argument("newValue", inputType)
  }

  val queryType: ObjectType[GraphQLContext, RelatedWord] = deriveObjectType()

  private val resolveEditWord: Resolver[RelatedWord, RelatedWord] = context => {
    context.ctx.tableDefs.futureRelatedWord(context.value.)
  }

  val mutationType: ObjectType[GraphQLContext, RelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, RelatedWord](
      Field("edit", RelatedWordGraphQLTypes.queryType, arguments = newValueArgument :: Nil, resolve = resolveEditWord)
    )
  )

}

object RelatedWordsGroupGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = {
    @unused
    implicit val x0: ObjectType[GraphQLContext, RelatedWord] = RelatedWordGraphQLTypes.queryType

    deriveObjectType()
  }

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  private val resolveRelatedWord: Resolver[RelatedWordsGroup, Option[RelatedWord]] = context => ???

  val mutationType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordGroupMutations",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("delete", BooleanType, resolve = resolveDeleteRelatedWordsGroup),
      Field("relatedWord", OptionType(RelatedWordGraphQLTypes.mutationType), arguments = wordArgument :: Nil, resolve = resolveRelatedWord)
    )
  )

}
