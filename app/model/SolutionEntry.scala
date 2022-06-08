package model

final case class SolutionEntry(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionEntrySubText],
  children: Seq[SolutionEntry]
)
