package model

import model.userSolution.{UserSolutionNode, UserSolutionsRepository}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with RelatedWordGroupRepository
    with RelatedWordRepository
    with AbbreviationsRepository
    with ExerciseRepository
    with UserSolutionsRepository
    with SolutionNodeRepository
    with SolutionNodeMatchesRepository
    with AnnotationRepository
    with ParagraphCitationAnnotationRepository
    with ExplanationAnnotationRepository
    with ParagraphSynonymRepository
    with CorrectionSummaryRepository {

  import profile.api._

  protected val cascade: ForeignKeyAction = ForeignKeyAction.Cascade

  protected implicit val applicabilityType: JdbcType[Applicability]               = MappedColumnType.base(_.entryName, Applicability.withNameInsensitive)
  protected implicit val correctnessType: JdbcType[Correctness]                   = MappedColumnType.base(_.entryName, Correctness.withNameInsensitive)
  protected implicit val matchStatusType: JdbcType[MatchStatus]                   = MappedColumnType.base(_.entryName, MatchStatus.withNameInsensitive)
  protected implicit val annotationImportanceType: JdbcType[AnnotationImportance] = MappedColumnType.base(_.entryName, AnnotationImportance.withNameInsensitive)
  protected implicit val errorTypeType: JdbcType[ErrorType]                       = MappedColumnType.base(_.entryName, ErrorType.withNameInsensitive)
  protected implicit val annotationTypeType: JdbcType[AnnotationType]             = MappedColumnType.base(_.entryName, AnnotationType.withNameInsensitive)

  def futureInsertExercise(title: String, text: String, sampleSolutions: Seq[SolutionNodeInput]): Future[Int] = {
    val actions = for {
      exerciseId <- exercisesTQ returning { exercisesTQ.map { _.id } } += Exercise(0, title, text)
      _          <- sampleSolutionNodesTQ ++= sampleSolutions.map { SampleSolutionNode.fromInput(exerciseId) }
    } yield exerciseId

    db.run(actions.transactionally)
  }

  def futureInsertUserSolutionForExercise(
    username: String,
    exerciseId: Int,
    userSolution: Seq[SolutionNodeInput],
    matches: Seq[GeneratedSolutionNodeMatch]
  ): Future[Unit] = {
    val dbMatches                    = matches.map { _.forDb }
    val paragraphCitationAnnotations = matches.flatMap { _.paragraphCitationAnnotations }
    val explanationAnnotations       = matches.flatMap { _.explanationAnnotation }

    val actions = for {
      _ <- userSolutionsTQ map { us => (us.username, us.exerciseId) } += (username, exerciseId)
      _ <- userSolutionNodesTQ ++= userSolution.map { UserSolutionNode.fromInput(username, exerciseId) }
      _ <- matchesTQ ++= dbMatches
      _ <- paragraphCitationAnnotationsTQ ++= paragraphCitationAnnotations
      _ <- explanationAnnotationTQ ++= explanationAnnotations

    } yield ()

    db.run(actions.transactionally)
  }

  def futureInsertCorrectionResult(matches: Seq[GeneratedSolutionNodeMatch]): Future[Unit] = {
    val dbMatches                    = matches.map { _.forDb }
    val paragraphCitationAnnotations = matches.flatMap { _.paragraphCitationAnnotations }
    val explanationAnnotations       = matches.flatMap { _.explanationAnnotation }

    val actions = for {
      _ <- DBIO.sequence { dbMatches.map { m => matchesTQ insertOrUpdate m } }
      _ <- DBIO.sequence { paragraphCitationAnnotations.map { p => paragraphCitationAnnotationsTQ insertOrUpdate p } }
      _ <- DBIO.sequence { explanationAnnotations.map { e => explanationAnnotationTQ insertOrUpdate e } }
    } yield ()

    db.run(actions.transactionally)
  }
}
