package model

import scala.concurrent.Future

final case class ParagraphCitationAnnotationKey(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String
)

trait ParagraphCitationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object paragraphCitationAnnotationsTQ extends TableQuery[ParagraphCitationAnnotationTable](new ParagraphCitationAnnotationTable(_)) {
    def byKey(key: ParagraphCitationAnnotationKey) = this.filter { parCit =>
      parCit.exerciseId === key.exerciseId && parCit.username === key.username && parCit.sampleNodeId === key.sampleNodeId && parCit.userNodeId === key.userNodeId && parCit.awaitedParagraph === key.awaitedParagraph
    }
  }

  def futureSelectParagraphCitationAnnotationsForUserNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[ParagraphCitationAnnotation]] =
    db.run {
      paragraphCitationAnnotationsTQ.filter { pca =>
        pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId && !pca.deleted
      }.result
    }

  def futureSelectParagraphCitationAnnotationsForMatch(
    exerciseId: Int,
    username: String,
    sampleNodeId: Int,
    userNodeId: Int
  ): Future[Seq[ParagraphCitationAnnotation]] = db.run {
    paragraphCitationAnnotationsTQ.filter { pca =>
      pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId && pca.sampleNodeId === sampleNodeId && !pca.deleted
    }.result
  }

  def futureSelectParagraphCitationAnnotation(key: ParagraphCitationAnnotationKey): Future[Option[ParagraphCitationAnnotation]] =
    db.run { paragraphCitationAnnotationsTQ.byKey { key }.result.headOption }

  def futureInsertParagraphCitationAnnotation(parCitAnno: ParagraphCitationAnnotation): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ += parCitAnno }
  } yield ()

  def futureUpsertParagraphCitationAnnotations(annos: Seq[ParagraphCitationAnnotation]): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ ++= annos }
  } yield ()

  def futureUpdateParagraphCitationAnnotation(key: ParagraphCitationAnnotationKey, newValues: ParagraphCitationAnnotationInput): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ.byKey { key }.map { _.editableValues } update newValues }
  } yield ()

  def futureDeletePararaphCitationAnnotation(key: ParagraphCitationAnnotationKey): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ.byKey { key }.map { _.deleted }.update { true } }
  } yield ()

  def futureSelectParagraphCitationAnnotationExplanationRecommendations(key: ParagraphCitationAnnotationKey): Future[Seq[String]] = for {
    maybeExpls <- db.run {
      paragraphCitationAnnotationsTQ
        .byKey { key }
        .join(paragraphCitationAnnotationsTQ)
        .on { case (anno, anno2) =>
          anno2.exerciseId === anno.exerciseId && anno2.username =!= anno.username && anno2.sampleNodeId === anno.sampleNodeId && anno2.awaitedParagraph === anno.awaitedParagraph
        }
        .map { _._2.explanation }
        .filter { _.nonEmpty }     // filter out None values
        .withFilter { _.nonEmpty } // filter out empty strings
        .result
    }
  } yield maybeExpls.flatten

  protected class ParagraphCitationAnnotationTable(tag: Tag) extends Table[ParagraphCitationAnnotation](tag, "paragraph_citation_annotations") {
    def exerciseId       = column[Int]("exercise_id")
    def username         = column[String]("username")
    def sampleNodeId     = column[Int]("sample_node_id")
    def userNodeId       = column[Int]("user_node_id")
    def awaitedParagraph = column[String]("awaited_paragraph")
    def correctness      = column[Correctness]("correctness")
    def citedParagraph   = column[Option[String]]("cited_paragraph")
    def explanation      = column[Option[String]]("explanation")
    def deleted          = column[Boolean]("deleted")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId, awaitedParagraph))

    def solutionMatch = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    def editableValues = (awaitedParagraph, correctness, citedParagraph, explanation).mapTo[ParagraphCitationAnnotationInput]

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
    ).mapTo[ParagraphCitationAnnotation]
  }
}
