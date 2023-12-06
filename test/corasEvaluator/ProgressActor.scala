package corasEvaluator

import org.apache.pekko.actor.typed.Behavior
import org.apache.pekko.actor.typed.scaladsl.Behaviors

sealed trait ProgressMessage:
  def exerciseId: Int
  def username: String

final case class InitialMatchingDone(exerciseId: Int, username: String) extends ProgressMessage

final case class NodeMatchingDoneMessage(exerciseId: Int, username: String) extends ProgressMessage

final case class ExerciseProgress(
  solutionsCount: Int,
  initialMatchingDoneCount: Int,
  nodeMatchingDoneCount: Int
):
  def forLog = s"$initialMatchingDoneCount / $nodeMatchingDoneCount / $solutionsCount"

object ProgressActor:

  def apply(solutionsCount: Map[Int, Int]): Behavior[ProgressMessage] = living {
    solutionsCount.view.mapValues { solutionsCount => ExerciseProgress(solutionsCount, 0, 0) }.toMap
  }

  private def progressLogMessage(progress: Map[Int, ExerciseProgress]): String = progress
    .map { case (exerciseId, exProgress) => s"$exerciseId -> ${exProgress.forLog}" }
    .mkString(" -- ")

  private def living(progress: Map[Int, ExerciseProgress]): Behavior[ProgressMessage] = Behaviors.receive {
    case (_ /* context */, InitialMatchingDone(exerciseId, _ /* username */ )) =>
      val newProgress = progress.updatedWith(exerciseId) {
        case None             => ???
        case Some(exProgress) => Some(exProgress.copy(initialMatchingDoneCount = exProgress.initialMatchingDoneCount + 1))
      }

      // TODO: log progress
      println(progressLogMessage(newProgress))

      living(newProgress)

    case (_ /* context */, NodeMatchingDoneMessage(exerciseId, _ /* username */ )) =>
      val newProgress = progress.updatedWith(exerciseId) {
        case None             => ???
        case Some(exProgress) => Some(exProgress.copy(nodeMatchingDoneCount = exProgress.nodeMatchingDoneCount + 1))
      }

      // TODO: log progress
      println(progressLogMessage(progress))

      living(newProgress)
  }
