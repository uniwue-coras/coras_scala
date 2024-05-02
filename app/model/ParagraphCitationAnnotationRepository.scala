package model

import scala.concurrent.{Future}

trait ParagraphCitationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object paragraphCitationAnnotationsTQ extends TableQuery[ParagraphCitationAnnotationTable](new ParagraphCitationAnnotationTable(_)) {
    def byId(
      exerciseId: Int,
      username: String,
      sampleNodeId: Int,
      userNodeId: Int,
      awaitedParagraph: String
    ): Query[ParagraphCitationAnnotationTable, DbParagraphCitationAnnotation, Seq] = this.filter { parCit =>
      parCit.exerciseId === exerciseId && parCit.username === username && parCit.sampleNodeId === sampleNodeId && parCit.userNodeId === userNodeId && parCit.awaitedParagraph === awaitedParagraph
    }
  }

  /*
  def futureSelectAllParagraphCitationAnnotationsForUserSolution(exerciseId: Int, username: String): Future[Seq[DbParagraphCitationAnnotation]] =
    db.run { paragraphCitationAnnotationsTQ.filter { pca => pca.exerciseId === exerciseId && pca.username === username }.result }
   */

  def futureSelectParagraphCitationAnnotationsForUserNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[DbParagraphCitationAnnotation]] =
    db.run {
      paragraphCitationAnnotationsTQ.filter { pca =>
        pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId && !pca.deleted
      }.result
    }

  def futureSelectParagraphCitationAnnotation(
    exerciseId: Int,
    username: String,
    sampleNodeId: Int,
    userNodeId: Int,
    awaitedParagraph: String
  ): Future[Option[DbParagraphCitationAnnotation]] = db.run {
    paragraphCitationAnnotationsTQ
      .filter { parCit =>
        parCit.exerciseId === exerciseId && parCit.username === username && parCit.sampleNodeId === sampleNodeId && parCit.userNodeId === userNodeId && parCit.awaitedParagraph === awaitedParagraph
      }
      .result
      .headOption
  }

  def futureUpsertParagraphCitationAnnotations(annos: Seq[DbParagraphCitationAnnotation]): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ ++= annos }
  } yield ()

  def futureDeletePararaphCitationAnnotation(exerciseId: Int, username: String, sampleNodeId: Int, userNodeId: Int, awaitedParagraph: String): Future[Unit] =
    for {
      _ <- db.run {
        paragraphCitationAnnotationsTQ
          .byId(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)
          .map { _.deleted }
          .update { true }
      }
    } yield ()

  def futureUpdateParagraphCitationAnnotationCorrectness(
    exerciseId: Int,
    username: String,
    sampleNodeId: Int,
    userNodeId: Int,
    awaitedParagraph: String,
    newCorrectness: Correctness
  ): Future[Unit] = for {
    _ <- db.run {
      paragraphCitationAnnotationsTQ
        .byId(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)
        .map { _.correctness }
        .update { newCorrectness }
    }
  } yield ()

  def futureUpdateParagraphCitationAnnotationExplanation(
    exerciseId: Int,
    username: String,
    sampleNodeId: Int,
    userNodeId: Int,
    awaitedParagraph: String,
    explanation: Option[String]
  ): Future[Unit] = for {
    _ <- db.run {
      paragraphCitationAnnotationsTQ
        .byId(exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph)
        .map { _.explanation }
        .update { explanation }
    }
  } yield ()

  protected class ParagraphCitationAnnotationTable(tag: Tag) extends Table[DbParagraphCitationAnnotation](tag, "paragraph_citation_annotations") {
    def exerciseId       = column[Int]("exercise_id")
    def username         = column[String]("username")
    def sampleNodeId     = column[Int]("sample_node_id")
    def userNodeId       = column[Int]("user_node_id")
    def awaitedParagraph = column[String]("awaited_paragraph")
    def correctness      = column[Correctness]("correctness")
    def citedParagraph   = column[Option[String]]("cited_paragraph")
    def explanation      = column[Option[String]]("explanation")
    def deleted          = column[Boolean]("deleted")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (
      exerciseId,
      username,
      sampleNodeId,
      userNodeId,
      awaitedParagraph,
      correctness,
      citedParagraph,
      explanation,
      deleted
    ).mapTo[DbParagraphCitationAnnotation]
  }
}
