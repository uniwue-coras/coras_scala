package model

import sangria.schema.{ObjectType, fields, Field, IntType, StringType, ListType}
import model.graphql.GraphQLContext
import model.graphql.GraphQLBasics

final case class ExerciseTextBlockGroup(
  exerciseId: Int,
  groupId: Int,
  textBlocks: Seq[String]
)

object ExerciseTextBlockGroup extends GraphQLBasics {
  val queryType = ObjectType(
    "ExerciseTextBlockGroup",
    fields[GraphQLContext, ExerciseTextBlockGroup](
      Field("groupId", IntType, resolve = _.value.groupId),
      Field("textBlocks", ListType(StringType), resolve = _.value.textBlocks)
    )
  )

  private val resolveUpdate: Resolver[ExerciseTextBlockGroup, ExerciseTextBlockGroup] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, group, _, args) =>
    implicit val ec = _ec
    val contents    = args.arg(contentsArguments)

    for {
      _ <- tableDefs.futureUpdateExerciseTextBlockGroup(group.exerciseId, group.groupId, contents)
    } yield group.copy(textBlocks = contents)
  }

  private val resolveDelete: Resolver[ExerciseTextBlockGroup, ExerciseTextBlockGroup] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, group, _, _) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteExerciseTextBlockGroup(group.exerciseId, group.groupId)
    } yield group
  }

  val mutationType = ObjectType(
    "ExerciseBlockGroupMutations",
    fields[GraphQLContext, ExerciseTextBlockGroup](
      Field("update", queryType, arguments = contentsArguments :: Nil, resolve = resolveUpdate),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}
