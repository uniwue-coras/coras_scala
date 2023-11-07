package model

import model.graphql.{GraphQLArguments, GraphQLContext, MutationType, QueryType, UserFacingGraphQLError}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{BooleanType, Field, ObjectType, fields}

import scala.concurrent.{ExecutionContext, Future}

final case class Abbreviation(abbreviation: String, word: String)

object AbbreviationGraphQLTypes extends QueryType[Abbreviation] with MutationType[Abbreviation] {

  override val queryType: ObjectType[GraphQLContext, Abbreviation] = deriveObjectType()

  private val resolveEdit: Resolver[Abbreviation, Abbreviation] = context => {
    @scala.annotation.unused
    implicit val ec: ExecutionContext = context.ctx.ec

    val input = context.arg(GraphQLArguments.abbreviationInputArgument)

    for {
      updated <- context.ctx.tableDefs.futureUpdateAbbreviation(context.value.abbreviation, input.abbreviation, input.word)
      _       <- futureFromBool(updated, UserFacingGraphQLError("Couldn't update abbreviation!"))
    } yield input
  }

  private val resolveDelete: Resolver[Abbreviation, Boolean] = context => context.ctx.tableDefs.futureDeleteAbbreviation(context.value.abbreviation)

  override val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = GraphQLArguments.abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", BooleanType, resolve = resolveDelete)
    )
  )

}

trait AbbreviationsRepository {
  self: TableDefs =>

  import profile.api._

  private val abbreviationsTQ = TableQuery[AbbreviationsTable]

  def futureAbbreviation(abbreviation: String): Future[Option[Abbreviation]] = for {
    maybeRow <- db.run { abbreviationsTQ.filter { _.abbreviation === abbreviation }.result.headOption }
  } yield maybeRow.map { case (abbreviation, word) => Abbreviation(abbreviation, word) }

  def futureAllAbbreviationsAsMap: Future[Map[String, String]] = for {
    abbreviations <- db.run(abbreviationsTQ.result)
  } yield abbreviations.toMap

  def futureAllAbbreviations: Future[Seq[Abbreviation]] = for {
    rows <- db.run(abbreviationsTQ.result)
  } yield rows.map { case (abbreviation, word) => Abbreviation(abbreviation, word) }

  def futureInsertAbbreviation(abbreviation: String, word: String): Future[Boolean] = for {
    rowCount <- db.run { abbreviationsTQ += (abbreviation, word) }
  } yield rowCount == 1

  def futureUpdateAbbreviation(abbreviation: String, newAbbreviation: String, newWord: String): Future[Boolean] = for {
    rowCount <- db.run {
      abbreviationsTQ.filter { _.abbreviation === abbreviation }.update { (newAbbreviation, newWord) }
    }
  } yield rowCount == 1

  def futureDeleteAbbreviation(abbreviation: String): Future[Boolean] = for {
    rowCount <- db.run { abbreviationsTQ.filter { _.abbreviation === abbreviation }.delete }
  } yield rowCount == 1

  protected class AbbreviationsTable(tag: Tag) extends Table[(String, String)](tag, "abbreviations") {
    def abbreviation     = column[String]("abbreviation", O.PrimaryKey)
    private def realText = column[String]("real_text")

    override def * = (abbreviation, realText)
  }

}
