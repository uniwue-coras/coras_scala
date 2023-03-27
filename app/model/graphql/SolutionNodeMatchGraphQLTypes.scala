package model.graphql

import model.{MatchStatus, SolutionNodeMatch}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

object SolutionNodeMatchGraphQLTypes {

  val queryType: ObjectType[Unit, SolutionNodeMatch] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: EnumType[MatchStatus] = MatchStatus.graphQLType

    deriveObjectType()
  }

}
