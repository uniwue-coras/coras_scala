package model

import scala.concurrent.Future

trait ParagraphCitationAnnotationRepository:
  self: TableDefs =>

  import profile.api._

  private val paragraphCitationAnnotationsTQ = TableQuery[ParagraphCitationAnnotationTable]

  def futureSelectAllParagraphCitationAnnotationsForUserSolution(exerciseId: Int, username: String): Future[Seq[ParagraphCitationAnnotation]] =
    db.run { paragraphCitationAnnotationsTQ.filter { pca => pca.exerciseId === exerciseId && pca.username === username }.result }

  private class ParagraphCitationAnnotationTable(tag: Tag) extends Table[ParagraphCitationAnnotation](tag, "paragraph_citation_annotations"):
    def exerciseId   = column[Int]("exercise_id")
    def username     = column[String]("username")
    def sampleNodeId = column[Int]("sample_node_id")
    def userNodeId   = column[Int]("user_node_id")
    def errorType = column[ErrorType]("error_type")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (exerciseId, username, sampleNodeId, userNodeId,errorType).mapTo[ParagraphCitationAnnotation]
