package model

import scala.concurrent.Future

trait ExplanationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected val explanationAnnotationTQ = TableQuery[ExplanationAnnotationTable]

  def futureInsertExplanationAnnotation(explAnno: DbExplanationAnnotation): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ += explAnno }
  } yield ()

  def futureInsertExplanationAnnotations(explAnnos: Seq[DbExplanationAnnotation]): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ ++= explAnnos }
  } yield ()

  def futureSelectExplanationAnnotationsForNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[ExplanationAnnotation]] = db.run {
    explanationAnnotationTQ.filter { explAnno =>
      explAnno.exerciseId === exerciseId && explAnno.username === username && explAnno.userNodeId === userNodeId
    }.result
  }

  def futureSelectExplanationAnnotationForMatch(exerciseId: Int, username: String, sampleNodeId: Int, userNodeId: Int): Future[Option[ExplanationAnnotation]] =
    db.run {
      explanationAnnotationTQ
        .filter { explAnno =>
          explAnno.exerciseId === exerciseId && explAnno.username === username && explAnno.sampleNodeId === sampleNodeId && explAnno.userNodeId === userNodeId
        }
        .result
        .headOption
    }

  protected class ExplanationAnnotationTable(tag: Tag) extends Table[DbExplanationAnnotation](tag, "explanation_annotations") {
    def exerciseId   = column[Int]("exercise_id")
    def username     = column[String]("username")
    def sampleNodeId = column[Int]("sample_node_id")
    def userNodeId   = column[Int]("user_node_id")
    def text         = column[String]("text")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (exerciseId, username, sampleNodeId, userNodeId, text).mapTo[DbExplanationAnnotation]
  }
}
