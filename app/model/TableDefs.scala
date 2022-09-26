package model

import com.github.tminglei.slickpg.utils.SimpleArrayUtils
import com.github.tminglei.slickpg.{ExPostgresProfile, PgEnumSupport, PgPlayJsonSupport}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{Json, OFormat}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

trait MyPostgresProfile extends ExPostgresProfile with PgEnumSupport with PgPlayJsonSupport {

  override val pgjson = "jsonb"

  trait MyAPI extends API with JsonImplicits {

    implicit val rightsType: JdbcType[Rights] = createEnumJdbcType("rights", _.entryName, Rights.withNameInsensitive, quoteName = false)

    implicit val applicabilityType: JdbcType[Applicability] =
      createEnumJdbcType("applicability", _.entryName, Applicability.withNameInsensitive, quoteName = false)

    @deprecated()
    implicit val subTextsListType: AdvancedArrayJdbcType[SolutionNodeSubText] = {
      implicit val solutionNodeSubTextFormat: OFormat[SolutionNodeSubText] = Json.format

      new AdvancedArrayJdbcType[SolutionNodeSubText](
        pgjson,
        str => SimpleArrayUtils.fromString(Json.parse(_).as[SolutionNodeSubText])(str).orNull,
        SimpleArrayUtils.mkString[SolutionNodeSubText](subText => Json.stringify(Json.toJson(subText)))
      )
    }

    /*
    @deprecated()
    implicit val correctionTypeMapper: JdbcType[SolutionNodeMatchingResult] with BaseTypedType[SolutionNodeMatchingResult] = {
      implicit val solutionNodeMatchingResultFormat: OFormat[SolutionNodeMatchingResult] = Correction.correctionJsonFormat

      MappedJdbcType.base[SolutionNodeMatchingResult, JsValue](Json.toJson(_), _.as[SolutionNodeMatchingResult])
    }
     */

  }

  override val api: MyAPI = new MyAPI {}

}

object MyPostgresProfile extends MyPostgresProfile

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(protected implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with SolutionRepository
    with SolutionNodeMatchesRepository {

  import MyPostgresProfile.api._

  def futureInsertExercise(title: String, text: String, sampleSolutions: Seq[FlatSolutionNode]): Future[Int] = {
    val actions = for {
      exerciseId                      <- exercisesTQ.returning(exercisesTQ.map(_.id)) += Exercise(0, title, text)
      _ /* sampleSolutionsInserted */ <- sampleSolutionNodesTQ ++= sampleSolutions.map(flatSolutionNode2DbSolNode(exerciseId, _))
    } yield exerciseId

    db.run(actions.transactionally)
  }

}
