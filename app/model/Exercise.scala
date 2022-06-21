package model

import com.scalatsi.{TSIType, TSType}
import model.graphql.{GraphQLArguments, GraphQLContext, UserFacingGraphQLError}
import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoComponents
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.play.json.compat.json2bson._
import sangria.macros.derive.{AddFields, ExcludeFields, deriveObjectType}
import sangria.schema._

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
import scala.util.{Failure, Success}

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNode]
)

final case class Exercise(
  id: Int,
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNode]
)

object Exercise {

  private implicit val solutionNodeJsonFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

  val exerciseInputJsonFormat: OFormat[ExerciseInput] = Json.format

  val exerciseJsonFormat: OFormat[Exercise] = Json.format

  val tsType: TSIType[Exercise] = {
    implicit val x0: TSIType[SolutionNode] = SolutionNode.solutionNodeTsType

    TSType.fromCaseClass
  }

}

trait MongoExerciseRepository extends MongoRepo {
  self: ReactiveMongoComponents =>

  private implicit val exerciseFormat: OFormat[Exercise] = Exercise.exerciseJsonFormat

  private def futureExercisesCollection: Future[BSONCollection] = futureCollection("exercises")

  def futureAllExercises: Future[Seq[Exercise]] = for {
    exercisesCollection <- futureExercisesCollection
    allExercises        <- exercisesCollection.find(BSONDocument.empty).cursor[Exercise]().collect[Seq]()
  } yield allExercises

  def futureExerciseById(exerciseId: Int): Future[Option[Exercise]] = for {
    exercisesCollection <- futureExercisesCollection
    maybeExercise <- exercisesCollection
      .find(BSONDocument("id" -> exerciseId))
      .one[Exercise]
  } yield maybeExercise

  def futureInsertExercise(exercise: Exercise): Future[Boolean] = for {
    exercisesCollection <- futureExercisesCollection
    insertResult        <- exercisesCollection.insert.one(exercise)
  } yield insertResult.n == 1

  def futureMaxExerciseId: Future[Option[Int]] = for {
    exercisesCollection <- futureExercisesCollection
    maybeExercise <- exercisesCollection
      .find(BSONDocument.empty)
      .sort(BSONDocument("id" -> -1))
      .one[Exercise]
    maxValue = maybeExercise.map(_.id)
  } yield maxValue

}

object ExerciseGraphQLModel extends GraphQLArguments {

  private implicit val ec: ExecutionContextExecutor = ExecutionContext.global

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    ExcludeFields("sampleSolution"),
    AddFields(
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = context =>
          context.ctx.user match {
            case None                       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
            case Some(User(username, _, _)) => context.ctx.mongoQueries.futureUserHasSubmittedSolution(context.value.id, username)
          }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = context => {
          context.ctx.resolveAdmin match {
            case Failure(exception) => Future.failed(exception)
            case Success(_)         => context.ctx.mongoQueries.futureUsersWithSolution(context.value.id)
          }
        }
      )
    )
  )
}
