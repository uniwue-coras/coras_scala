package model.graphql

import model.{Exercise, TableDefs}

import scala.concurrent.Future

object Query {

  def handleExercises(tableDefs: TableDefs): Future[Seq[Exercise]] = ???

  def handleExercise(tableDefs: TableDefs, exerciseId: Int): Future[Option[Exercise]] = ???

}
