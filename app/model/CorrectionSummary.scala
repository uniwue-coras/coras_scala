package model

import model.graphql.{GraphQLContext, MyInputType, QueryType}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema.{InputObjectType, ObjectType}

import scala.annotation.unused
import scala.concurrent.Future

final case class CorrectionSummary(comment: String, points: Int)

object CorrectionSummaryGraphQLTypes extends QueryType[CorrectionSummary] with MyInputType[CorrectionSummary] {
  override val inputType: InputObjectType[CorrectionSummary]            = deriveInputObjectType(InputObjectTypeName("CorrectionSummaryInput"))
  override val queryType: ObjectType[GraphQLContext, CorrectionSummary] = deriveObjectType()
}

trait CorrectionSummaryRepository {
  self: TableDefs =>

  import profile.api._

  private val correctionResultsTQ = TableQuery[CorrectionSummaryTable]

  def futureCorrectionSummaryForSolution(exerciseId: Int, username: String): Future[Option[CorrectionSummary]] = for {
    maybeRow <- db.run { correctionResultsTQ.filter { cr => cr.exerciseId === exerciseId && cr.username === username }.result.headOption }
    result = maybeRow.map { case (_, _, comment, points) => CorrectionSummary(comment, points) }
  } yield result

  def futureUpsertCorrectionResult(username: String, exerciseId: Int, comment: String, points: Int): Future[Boolean] = for {
    rowCount <- db.run { correctionResultsTQ insertOrUpdate ((exerciseId, username, comment, points)) }
  } yield rowCount == 1

  private class CorrectionSummaryTable(tag: Tag) extends Table[(Int, String, String, Int)](tag, "correction_summaries") {
    def exerciseId      = column[Int]("exercise_id")
    def username        = column[String]("username")
    private def comment = column[String]("comment")
    private def points  = column[Int]("points")

    @unused def pk = primaryKey("correction_results_pk", (exerciseId, username))
    @unused def userSolutionsFk = foreignKey("correction_results_user_solutions_fk", (exerciseId, username), userSolutionsTQ)(
      userSolution => (userSolution.exerciseId, userSolution.username),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (exerciseId, username, comment, points)
  }

}
