package model

import com.github.tminglei.slickpg.utils.SimpleArrayUtils
import com.github.tminglei.slickpg.{ExPostgresProfile, PgEnumSupport, PgPlayJsonSupport}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.{Json, OFormat}
import slick.jdbc.{JdbcProfile, JdbcType}

import javax.inject.Inject
import scala.concurrent.ExecutionContext

trait MyPostgresProfile extends ExPostgresProfile with PgEnumSupport with PgPlayJsonSupport {

  override val pgjson = "jsonb"

  private implicit val solutionNodeFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

  trait MyAPI extends super.API with JsonImplicits {

    implicit val rightsType: JdbcType[Rights] = createEnumJdbcType("rights_type", _.entryName, Rights.withNameInsensitive, quoteName = false)

    implicit val solutionNodeListTypeMapper: AdvancedArrayJdbcType[SolutionNode] = new AdvancedArrayJdbcType[SolutionNode](
      pgjson,
      str => SimpleArrayUtils.fromString(str => Json.fromJson(Json.parse(str)).getOrElse(null))(str).orNull,
      SimpleArrayUtils.mkString((node: SolutionNode) => Json.stringify(Json.toJson(node)))
    )

  }

  override val api: MyAPI = new MyAPI {}

}

object MyPostgresProfile extends MyPostgresProfile

class TableDefs @Inject() (override protected val dbConfigProvider: DatabaseConfigProvider)(override implicit val ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with UserRepository
    with ExerciseRepository
    with UserSolutionRepository
