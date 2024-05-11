package model

import scala.concurrent.Future

trait ExplanationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object explanationAnnotationTQ extends TableQuery[ExplanationAnnotationTable](new ExplanationAnnotationTable(_)) {
    def byKey(key: SolutionNodeMatchKey) = this.filter { explAnno =>
      explAnno.exerciseId === key.exerciseId && explAnno.username === key.username && explAnno.sampleNodeId === key.sampleNodeId && explAnno.userNodeId === key.userNodeId
    }
  }

  def futureInsertExplanationAnnotation(explAnno: DbExplanationAnnotation): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ += explAnno }
  } yield ()

  def futureInsertExplanationAnnotations(explAnnos: Seq[DbExplanationAnnotation]): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ ++= explAnnos }
  } yield ()

  def futureSelectExplanationAnnotationsForNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[DbExplanationAnnotation]] = db.run {
    explanationAnnotationTQ.filter { explAnno =>
      explAnno.exerciseId === exerciseId && explAnno.username === username && explAnno.userNodeId === userNodeId
    }.result
  }

  def futureSelectExplanationAnnotationForMatch(key: SolutionNodeMatchKey): Future[Option[DbExplanationAnnotation]] = db.run {
    explanationAnnotationTQ.byKey { key }.result.headOption
  }

  def futureDeleteExplanationAnnotation(key: SolutionNodeMatchKey): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ.byKey { key }.delete }
  } yield ()

  def futureUpdateExplanationAnnotation(key: SolutionNodeMatchKey, newText: String): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ.byKey { key }.map { _.text }.update { newText } }
  } yield ()

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
