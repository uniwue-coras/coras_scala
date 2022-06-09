package model

final case class SolutionEntry(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionEntrySubText],
  children: Seq[SolutionEntry]
)

final case class MyFlatSolutionEntry(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionEntrySubText],
  parentId: Option[Int]
)

object SolutionEntry {

  def flattenTree(solutionEntry: SolutionEntry, parentId: Option[Int] = None): Seq[MyFlatSolutionEntry] = solutionEntry match {
    case SolutionEntry(id, text, applicability, subTexts, children) =>
      MyFlatSolutionEntry(id, text, applicability, subTexts, parentId) +: children.flatMap((c) => flattenTree(c, Some(id)))
  }

  def inflateTree(flatSolutionEntries: Seq[MyFlatSolutionEntry]): SolutionEntry = ???

}
