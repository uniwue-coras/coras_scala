package model

import model.AnalyzedSubText.AnalyzedSampleSubText
import model.ParagraphCitation.SampleSolutionParagraphCitation
import model.solution_entry.{FlatSampleSolutionEntry, FlatSampleSolutionEntryRepo, FlatSolutionEntryInput}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepo
    with FlatSampleSolutionEntryRepo
    with AnalyzedSubTextRepo
    with ParagraphCitationRepo {

  import profile.api._

  protected implicit val applicabilityType: BaseColumnType[Applicability] = MappedColumnType.base[Applicability, String](_.entryName, Applicability.withName)

  private type ExtractionType = (Seq[FlatSampleSolutionEntry], Seq[AnalyzedSampleSubText], Seq[SampleSolutionParagraphCitation])

  private val extractionStartValue: ExtractionType = (Seq.empty, Seq.empty, Seq.empty)

  private def extractSampleSolution(
    exerciseId: Int,
    sampleSolution: Seq[FlatSolutionEntryInput]
  ): ExtractionType = sampleSolution.foldLeft(extractionStartValue) {
    case (
          (entriesAcc, subTextsAcc, paragraphCitationsAcc),
          FlatSolutionEntryInput(entryId, text, applicability, weight, priorityPoints, parentId, subTexts, paragraphCitations)
        ) =>
      val sampleEntry = FlatSampleSolutionEntry(exerciseId, entryId, text, applicability, weight, priorityPoints, parentId)

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

          _ /*paragraphCitationsSaved*/ <- sampleSolutionParagraphCitationsTableTQ ++= paragraphCitations

        } yield exerciseId).transactionally
      }
  }

}
