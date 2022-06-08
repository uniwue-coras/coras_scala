package model

import scala.concurrent.{ExecutionContext, Future}

trait NodeMatchRepo {
  self: TableDefs =>

  import profile.api._

  implicit val ec: ExecutionContext

  protected val solutionEntryMatchesTQ = TableQuery[SolutionEntryMatchesTable]

  def futureInsertNodeMatch(username: String, exerciseId: Int, sampleEntryId: Int, userEntryId: Int): Future[Boolean] =
    db.run(solutionEntryMatchesTQ += (username, exerciseId, sampleEntryId, userEntryId)).map(_ == 1)

  protected class SolutionEntryMatchesTable(tag: Tag) extends Table[(String, Int, Int, Int)](tag, "solution_entry_matches") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def sampleEntryId = column[Int]("sample_entry_id")

    def userEntryId = column[Int]("user_entry_id")

    override def * = (username, exerciseId, sampleEntryId, userEntryId)

  }

}
