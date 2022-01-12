package model

import model.AnalyzedSubText.{AnalyzedSampleSubText, AnalyzedUserSubText}
import model.FlatSolutionEntry.{FlatSampleSolutionEntry, FlatUserSolutionEntry}
import model.ParagraphCitation.{SampleSolutionParagraphCitation, UserSolutionParagraphCitation}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepo
    with FlatSolutionEntryRepo
    with AnalyzedSubTextRepo
    with ParagraphCitationRepo {

  import profile.api._

  private type SampleSolutionExtractionType = (Seq[FlatSampleSolutionEntry], Seq[AnalyzedSampleSubText], Seq[SampleSolutionParagraphCitation])
  private type UserSolutionExtractionType   = (Seq[FlatUserSolutionEntry], Seq[AnalyzedUserSubText], Seq[UserSolutionParagraphCitation])

  private val sampleSolutionExtractionStartValue: SampleSolutionExtractionType = (Seq.empty, Seq.empty, Seq.empty)
  private val userSolutionExtractionStartValue: UserSolutionExtractionType     = (Seq.empty, Seq.empty, Seq.empty)

  protected implicit val applicabilityType: BaseColumnType[Applicability] = MappedColumnType.base[Applicability, String](_.entryName, Applicability.withName)

  private def extractSampleSolution(
    exerciseId: Int,
    sampleSolution: Seq[FlatSolutionEntryInput]
  ): SampleSolutionExtractionType = sampleSolution.foldLeft(sampleSolutionExtractionStartValue) {
    case (
          (entriesAcc, subTextsAcc, paragraphCitationsAcc),
          FlatSolutionEntryInput(entryId, text, applicability, weight, priorityPoints, parentId, subTexts, paragraphCitations)
        ) =>
      val sampleEntry = (exerciseId, entryId, text, applicability, weight, priorityPoints, parentId)

      val sampleSubTexts = subTexts.zipWithIndex.map { case (AnalyzedSubText(text, applicability), index) =>
        (exerciseId, entryId, index, text, applicability)
      }

      val sampleParagraphCitations = paragraphCitations.zipWithIndex.map {
        case (ParagraphCitationInput(startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode), index) =>
          (exerciseId, entryId, index, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)
      }

      (entriesAcc :+ sampleEntry, subTextsAcc ++ sampleSubTexts, paragraphCitationsAcc ++ sampleParagraphCitations)
  }

  def futureInsertCompleteExercise(exerciseInput: ExerciseInput): Future[Int] = exerciseInput match {
    case ExerciseInput(title, text, sampleSolutionInput) =>
      db.run {
        (for {
          exerciseId <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(-1, text, title)

          (entries, subTexts, paragraphCitations) = extractSampleSolution(exerciseId, sampleSolutionInput)

          _ /*entriesSaved*/ <- flatSampleSolutionEntriesTableTQ ++= entries

          _ /*subTextsSaved*/ <- sampleSubTextsTQ ++= subTexts

          _ /*paragraphCitationsSaved*/ <- sampleSolutionParagraphCitationsTQ ++= paragraphCitations

        } yield exerciseId).transactionally
      }
  }

  private def extractUserSolution(
    exerciseId: Int,
    username: String,
    solution: Seq[FlatSolutionEntryInput]
  ): UserSolutionExtractionType = solution.foldLeft(userSolutionExtractionStartValue) {
    case (
          (entriesAcc, subTextsAcc, paragraphCitationsAcc),
          FlatSolutionEntryInput(entryId, text, applicability, weight, priorityPoints, parentId, subTexts, paragraphCitations)
        ) =>
      val userEntry = (exerciseId, username, entryId, text, applicability, weight, priorityPoints, parentId)

      val userSubTexts = subTexts.zipWithIndex.map { case (AnalyzedSubText(text, applicability), index) =>
        (exerciseId, username, entryId, index, text, applicability)
      }

      val userParagraphCitations = paragraphCitations.zipWithIndex.map {
        case (ParagraphCitationInput(startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode), index) =>
          (exerciseId, username, entryId, index, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)
      }

      (entriesAcc :+ userEntry, subTextsAcc ++ userSubTexts, paragraphCitationsAcc ++ userParagraphCitations)
  }

  def futureInsertCompleteSolution(exerciseId: Int, username: String, solution: Seq[FlatSolutionEntryInput]): Future[Boolean] = {

    val (entries, subtexts, paragraphCitations) = extractUserSolution(exerciseId, username, solution)

    db.run {
      (for {
        _ /*entriesSaved*/ <- flatUserSolutionEntriesTableTQ ++= entries

        _ /*subTextsSaved*/ <- userSubTextsTQ ++= subtexts

        _ /*paragraphCitationsSaved*/ <- userSolutionParagraphCitationsTQ ++= paragraphCitations
      } yield true).transactionally
    }
  }

}
