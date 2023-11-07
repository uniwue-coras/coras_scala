package model.levenshtein

final case class LevenshteinResult(
  s1: String,
  s2: String,
  private val dist: Array[Array[Int]]
) {

  lazy val distance: Int = dist(s2.length)(s1.length)

}
