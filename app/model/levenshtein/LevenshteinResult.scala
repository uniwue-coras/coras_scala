package model.levenshtein

final case class LevenshteinResult(
  s1: String,
  s2: String,
  private val dist: Array[Array[Int]]
) {

  private val cellWidth = 3

  private def printDist: String = {

    def padToWidth(str: String): String = str.reverse.padTo(cellWidth, ' ').reverse

    val header = "  " + ("_" :: s1.toList).map(x => padToWidth(x.toString)).mkString(" ")
    val lines = (("_" :: s2.toList) zip dist).map { case (letter, row) =>
      val cells = row.map { entry => padToWidth(entry.toString) }
      letter.toString + " " + cells.mkString(" ")
    }

    header + "\n" + lines.mkString("\n")
  }

  lazy val distance: Int = dist(s2.length)(s1.length)

  private val movements: Seq[(Int, Int, (() => Char, () => Char) => Operation)] = Seq(
    (-1, -1, (a, b) => if (a() == b()) NoOp else Replacement(b(), a())),
    (-1, 0, (a, _) => Insertion(a())),
    (0, -1, (_, b) => Deletion(b()))
  )

  lazy val operations: Seq[Operation] = {
    @scala.annotation.tailrec
    def go(cell: Int, row: Int, acc: List[Operation]): Seq[Operation] = movements
      .map { case (cellMov, rowMove, createOp) => (cell + cellMov, row + rowMove, createOp) }
      .filter { case (targetCell, targetRow, _) => targetCell >= 0 && targetRow >= 0 }
      .flatMap { case (targetCell, targetRow, createOperation) =>
        val cost = dist(row)(cell) - dist(targetRow)(targetCell)

        if (cost < 0) {
          None
        } else {
          Some((cost, targetCell, targetRow, createOperation(() => s1(targetCell), () => s2(targetRow))))
        }
      }
      .maxByOption { _._1 } match {
      case None                                  => acc
      case Some((_, newCell, newRow, operation)) => go(newCell, newRow, operation :: acc)
    }

    go(s1.length, s2.length, List.empty)
  }

  /*
  def agreements: Seq[Agreement] = {

    val ops = operations

    Seq.empty
  }
   */

}