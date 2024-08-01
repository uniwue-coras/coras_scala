package model

import sangria.schema.{ObjectType, fields, Field, IntType, StringType, ListType}
import model.graphql.GraphQLContext
import model.graphql.GraphQLBasics

final case class ExerciseTextBlockEnd(
  exerciseId: Int,
  blockId: Int,
  text: String
)

final case class ExerciseTextBlock(
  exerciseId: Int,
  id: Int,
  startText: String
)

object ExerciseTextBlock extends GraphQLBasics {

  private val resolveEnds: Resolver[ExerciseTextBlock, Seq[String]] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, block, _, _) =>
    tableDefs.futureExerciseTextBlockEnds(block.exerciseId, block.id)
  }

  val queryType = ObjectType(
    "ExerciseTextBlock",
    fields[GraphQLContext, ExerciseTextBlock](
      Field("id", IntType, resolve = _.value.id),
      Field("startText", StringType, resolve = _.value.startText),
      Field("ends", ListType(StringType), resolve = resolveEnds)
    )
  )

  private val resolveSwap: Resolver[ExerciseTextBlock, ExerciseTextBlock] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, block, _, args) =>
    implicit val ec   = _ec
    val secondBlockId = args.arg(secondBlockIdArg)

    for {
      _ <- tableDefs.futureSwapTextBlocks(block.exerciseId, block.id, secondBlockId)
    } yield block
  }

  private val resolveUpdate: Resolver[ExerciseTextBlock, ExerciseTextBlock] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, block, _, args) =>
    implicit val ec                             = _ec
    val ExerciseTextBlockInput(startText, ends) = args.arg(exerciseTextBlockInputArg)

    for {
      _ <- tableDefs.futureUpdateExerciseTextBlock(block.exerciseId, block.id, startText, ends)
    } yield block.copy(startText = startText)
  }

  private val resolveDelete: Resolver[ExerciseTextBlock, ExerciseTextBlock] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, block, _, _) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteExerciseTextBlock(block.exerciseId, block.id)
    } yield block
  }

  val mutationType = ObjectType(
    "ExerciseBlockGroupMutations",
    fields[GraphQLContext, ExerciseTextBlock](
      Field("swap", queryType, arguments = secondBlockIdArg :: Nil, resolve = resolveSwap),
      Field("update", queryType, arguments = exerciseTextBlockInputArg :: Nil, resolve = resolveUpdate),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}
