package model

import com.github.tminglei.slickpg.utils.SimpleArrayUtils
import com.github.tminglei.slickpg.{ExPostgresProfile, PgEnumSupport, PgPlayJsonSupport}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{JsValue, Json, OFormat}
import slick.ast.BaseTypedType
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.ExecutionContext

trait MyPostgresProfile extends ExPostgresProfile with PgEnumSupport with PgPlayJsonSupport {

  override val pgjson = "jsonb"

  trait MyAPI extends super.API with JsonImplicits {

    implicit val rightsType: JdbcType[Rights] = createEnumJdbcType("rights_type", _.entryName, Rights.withNameInsensitive, quoteName = false)

    implicit val solutionNodeListTypeMapper: AdvancedArrayJdbcType[SolutionNode] = {
      implicit val solutionNodeFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

      new AdvancedArrayJdbcType[SolutionNode](
        pgjson,
        str => SimpleArrayUtils.fromString(Json.parse(_).as[SolutionNode])(str).orNull,
        SimpleArrayUtils.mkString[SolutionNode](node => Json.stringify(Json.toJson(node)))
      )
    }

    implicit val correctionTypeMapper: JdbcType[SolutionNodeMatchingResult] with BaseTypedType[SolutionNodeMatchingResult] = {
      implicit val solutionNodeMatchingResultFormat: OFormat[SolutionNodeMatchingResult] = Correction.correctionJsonFormat

      MappedJdbcType.base[SolutionNodeMatchingResult, JsValue](Json.toJson(_), _.as[SolutionNodeMatchingResult])
    }

  }

  override val api: MyAPI = new MyAPI {}

}

object MyPostgresProfile extends MyPostgresProfile

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with UserSolutionRepository
    with CorrectionRepository
