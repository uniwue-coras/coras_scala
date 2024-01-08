package model

final case class UserSolutionInput(
  username: String,
  solution: Seq[FlatSolutionNodeInput]
)

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
)
