package model.graphql

import model.{RelatedWord, RelatedWordsGroup, RelatedWordsGroupInput}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.annotation.unused

object RelatedWordGraphQLTypes extends GraphQLBasics {

  val inputType: InputObjectType[RelatedWord] = deriveInputObjectType(
    InputObjectTypeName("RelatedWordInput")
  )

  val queryType: ObjectType[GraphQLContext, RelatedWord] = deriveObjectType()

}

object RelatedWordsGroupGraphQLTypes extends GraphQLBasics {

  val inputType: InputObjectType[RelatedWordsGroupInput] = {
    @unused
    implicit val x0: InputObjectType[RelatedWord] = RelatedWordGraphQLTypes.inputType

    deriveInputObjectType()
  }

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = {
    @unused
    implicit val x0: ObjectType[GraphQLContext, RelatedWord] = RelatedWordGraphQLTypes.queryType

    deriveObjectType()
  }

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  val mutationType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordGroupMutations",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("delete", BooleanType, resolve = resolveDeleteRelatedWordsGroup)
    )
  )

}
