package model

import scala.concurrent.Future
import scala.language.postfixOps

final case class ExplanationAnnotationKey(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  text: String
)

trait ExplanationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object explanationAnnotationTQ extends TableQuery[ExplanationAnnotationTable](new ExplanationAnnotationTable(_)) {
    def forMatch(key: SolutionNodeMatchKey) = this.filter { explAnno =>
      explAnno.exerciseId === key.exerciseId && explAnno.username === key.username && explAnno.sampleNodeId === key.sampleNodeId && explAnno.userNodeId === key.userNodeId
    }

    def byKey(key: ExplanationAnnotationKey) = this.filter { explAnno =>
      explAnno.exerciseId === key.exerciseId && explAnno.username === key.username && explAnno.sampleNodeId === key.sampleNodeId && explAnno.userNodeId === key.userNodeId && explAnno.text === key.text
    }
  }

  def futureSelectExplanationAnnotationsForMatch(matchKey: SolutionNodeMatchKey): Future[Seq[ExplanationAnnotation]] =
    db.run { explanationAnnotationTQ forMatch matchKey result }

  def futureSelectExplanationAnnotation(key: ExplanationAnnotationKey): Future[Option[ExplanationAnnotation]] =
    db.run { explanationAnnotationTQ.byKey { key }.result.headOption }

  def futureInsertExplanationAnnotation(explAnno: ExplanationAnnotation): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ += explAnno }
  } yield ()

  def futureInsertExplanationAnnotations(explAnnos: Seq[ExplanationAnnotation]): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ ++= explAnnos }
  } yield ()

  def futureUpdateExplanationAnnotation(key: ExplanationAnnotationKey, newText: String): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ byKey key map { _.text } update newText }
  } yield ()

  def futureDeleteExplanationAnnotation(key: ExplanationAnnotationKey): Future[Unit] = for {
    _ <- db.run { explanationAnnotationTQ byKey key delete }
  } yield ()

  def futureSelectExplanationAnnotationRecommendations(key: SolutionNodeMatchKey): Future[Seq[String]] = db.run {
    explanationAnnotationTQ
      .filter { expl => expl.exerciseId === key.exerciseId && expl.username =!= key.username && expl.sampleNodeId === key.sampleNodeId }
      .map { _.text }
      .result
  }

  protected class ExplanationAnnotationTable(tag: Tag) extends Table[ExplanationAnnotation](tag, "explanation_annotations") {
    def exerciseId   = column[Int]("exercise_id")
    def username     = column[String]("username")
    def sampleNodeId = column[Int]("sample_node_id")
    def userNodeId   = column[Int]("user_node_id")
    def text         = column[String]("text", O.Length(500))

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId, text))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (exerciseId, username, sampleNodeId, userNodeId, text).mapTo[ExplanationAnnotation]
  }
}
