package model.levenshtein

sealed trait Operation

object NoOp extends Operation

final case class Insertion(c: Char) extends Operation

final case class Deletion(c: Char) extends Operation

final case class Replacement(c1: Char, c2: Char) extends Operation