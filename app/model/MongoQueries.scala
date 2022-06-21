package model

import play.modules.reactivemongo.{ReactiveMongoApi, ReactiveMongoComponents}
import reactivemongo.api.bson.collection.BSONCollection

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

trait MongoRepo {
  self: ReactiveMongoComponents =>

  protected implicit val ec: ExecutionContext

  protected def futureCollection(name: String): Future[BSONCollection] = for {
    db <- reactiveMongoApi.database
  } yield db.collection(name)

}

class MongoQueries @Inject() (override val reactiveMongoApi: ReactiveMongoApi)(override protected implicit val ec: ExecutionContext)
    extends ReactiveMongoComponents
    with MongoUserRepository
    with MongoExerciseRepository
    with MongoUserSolutionRepository