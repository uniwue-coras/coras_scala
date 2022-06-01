package model

import model.AnalyzedSubText.{AnalyzedSampleSubText, AnalyzedUserSubText}
import model.FlatSolutionEntry.{FlatSampleSolutionEntry, FlatUserSolutionEntry}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepo
    with FlatSolutionEntryRepo
    with AnalyzedSubTextRepo {

  import profile.api._

  private type SampleSolutionExtractionType = (Seq[FlatSampleSolutionEntry], Seq[AnalyzedSampleSubText])
  private type UserSolutionExtractionType   = (Seq[FlatUserSolutionEntry], Seq[AnalyzedUserSubText])

  private val sampleSolutionExtractionStartValue: SampleSolutionExtractionType = (Seq.empty, Seq.empty)
  private val userSolutionExtractionStartValue: UserSolutionExtractionType     = (Seq.empty, Seq.empty)

  protected implicit val applicabilityType: BaseColumnType[Applicability] = MappedColumnType.base[Applicability, String](_.entryName, Applicability.withName)

  private def extractSampleSolution(
    exerciseId: Int,
    sampleSolution: Seq[FlatSolutionEntryInput]
  ): SampleSolutionExtractionType = sampleSolution.foldLeft(sampleSolutionExtractionStartValue) {
    case (
          (entriesAcc, subTextsAcc),
          FlatSolutionEntryInput(entryId, text, applicability, weight, priorityPoints, parentId, subTexts)
        ) =>
      val sampleEntry = (exerciseId, entryId, text, applicability, weight, priorityPoints, parentId)

      val sampleSubTexts = subTexts.zipWithIndex.map { case (AnalyzedSubText(text, applicability), index) =>
        (exerciseId, entryId, index, text, applicability)
      }

      (entriesAcc :+ sampleEntry, subTextsAcc ++ sampleSubTexts)
  }

  def futureInsertCompleteExercise(exerciseInput: ExerciseInput): Future[Int] = exerciseInput match {
    case ExerciseInput(title, text, sampleSolutionInput) =>
      db.run {
        (for {
          exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(-1, title, text)

          (entries, subTexts) = extractSampleSolution(exerciseId, sampleSolutionInput)

          _ /*entriesSaved*/ <- flatSampleSolutionEntriesTableTQ ++= entries

          _ /*subTextsSaved*/ <- sampleSubTextsTQ ++= subTexts

        } yield exerciseId).transactionally
      }
  }

  private def extractUserSolution(
    exerciseId: Int,
    username: String,
    solution: Seq[FlatSolutionEntryInput]
  ): UserSolutionExtractionType = solution.foldLeft(userSolutionExtractionStartValue) {
    case (
          (entriesAcc, subTextsAcc),
          FlatSolutionEntryInput(entryId, text, applicability, weight, priorityPoints, parentId, subTexts)
        ) =>
      val userEntry = (exerciseId, username, entryId, text, applicability, weight, priorityPoints, parentId)

      val userSubTexts = subTexts.zipWithIndex.map { case (AnalyzedSubText(text, applicability), index) =>
        (exerciseId, username, entryId, index, text, applicability)
      }

      (entriesAcc :+ userEntry, subTextsAcc ++ userSubTexts)
  }

  def futureInsertCompleteSolution(exerciseId: Int, username: String, solution: Seq[FlatSolutionEntryInput]): Future[Boolean] = {

    val (entries, subtexts) = extractUserSolution(exerciseId, username, solution)

    db.run {
      (for {
        _ /*entriesSaved*/ <- flatUserSolutionEntriesTableTQ ++= entries

        _ /*subTextsSaved*/ <- userSubTextsTQ ++= subtexts
      } yield true).transactionally
    }
  }

}
