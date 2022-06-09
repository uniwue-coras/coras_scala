package model

import model.FlatSolutionEntry.{FlatSampleSolutionEntry, FlatUserSolutionEntry}
import model.Solution.{Solution, inflateSolution}
import model.SolutionEntrySubText.{AnalyzedSampleSubText, AnalyzedUserSubText}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepo
    with FlatSolutionEntryRepo
    with EntrySubTextRepo
    with NodeMatchRepo {

  import profile.api._

  private type SampleSolutionExtractionType = (Seq[FlatSampleSolutionEntry], Seq[AnalyzedSampleSubText])
  private type UserSolutionExtractionType   = (Seq[FlatUserSolutionEntry], Seq[AnalyzedUserSubText])

  protected implicit val applicabilityType: BaseColumnType[Applicability] = MappedColumnType.base[Applicability, String](_.entryName, Applicability.withName)

  private def extractSampleSolution(
    exerciseId: Int,
    sampleSolution: Seq[FlatSolutionEntryInput]
  ): SampleSolutionExtractionType = sampleSolution.foldLeft[SampleSolutionExtractionType]((Seq.empty, Seq.empty)) {
    case ((entriesAcc, subTextsAcc), FlatSolutionEntryInput(entryId, text, applicability, parentId, subTexts)) =>
      val sampleEntry = (exerciseId, entryId, text, applicability, parentId)

      val sampleSubTexts = subTexts.zipWithIndex.map { case (SolutionEntrySubText(text, applicability), index) =>
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
  ): UserSolutionExtractionType = solution.foldLeft[UserSolutionExtractionType]((Seq.empty, Seq.empty)) {
    case ((entriesAcc, subTextsAcc), FlatSolutionEntryInput(entryId, text, applicability, parentId, subTexts)) =>
      val userEntry = (username, exerciseId, entryId, text, applicability, parentId)

      val userSubTexts = subTexts.zipWithIndex.map { case (SolutionEntrySubText(text, applicability), index) =>
        (username, exerciseId, entryId, index, text, applicability)
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

  def loadSampleSolution(exerciseId: Int): Future[Solution] = for {
    entries  <- futureSampleSolutionForExercise(exerciseId)
    subTexts <- futureSubTextsForSampleSolution(exerciseId)
  } yield Solution.inflateSolution(entries, subTexts)._1

  def loadUserSolution(exerciseId: Int, username: String): Future[Solution] = for {
    entries  <- futureUserSolutionForExercise(exerciseId, username)
    subTexts <- futureSubTextsForUserSolution(username, exerciseId)
  } yield Solution.inflateSolution(entries, subTexts)._1

}
