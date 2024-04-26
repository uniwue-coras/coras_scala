package model

import scala.concurrent.{Future}

trait ParagraphCitationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected val paragraphCitationAnnotationsTQ = TableQuery[ParagraphCitationAnnotationTable]

  def futureSelectAllParagraphCitationAnnotationsForUserSolution(exerciseId: Int, username: String): Future[Seq[DbParagraphCitationAnnotation]] =
    db.run { paragraphCitationAnnotationsTQ.filter { pca => pca.exerciseId === exerciseId && pca.username === username }.result }

  def futureSelectParagraphCitationAnnotationsForUserNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[DbParagraphCitationAnnotation]] =
    db.run {
      paragraphCitationAnnotationsTQ.filter { pca => pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId }.result
    }

  def futureUpsertParagraphCitationAnnotations(annos: Seq[DbParagraphCitationAnnotation]): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ ++= annos }
  } yield ()

  protected class ParagraphCitationAnnotationTable(tag: Tag) extends Table[DbParagraphCitationAnnotation](tag, "paragraph_citation_annotations") {
    def exerciseId       = column[Int]("exercise_id")
    def username         = column[String]("username")
    def sampleNodeId     = column[Int]("sample_node_id")
    def userNodeId       = column[Int]("user_node_id")
    def awaitedParagraph = column[String]("awaited_paragraph")
    def citedParagraph   = column[Option[String]]("cited_paragraph")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph, citedParagraph).mapTo[DbParagraphCitationAnnotation]
  }
}
