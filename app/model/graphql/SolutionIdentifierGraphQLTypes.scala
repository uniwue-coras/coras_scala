package model.graphql

import model.CorrectionStatus
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.annotation.unused

final case class SolutionIdentifier(
  exerciseId: Int,
  exerciseTitle: String,
  correctionStatus: Option[CorrectionStatus]
)

object SolutionIdentifierGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[Unit, SolutionIdentifier] = {
    @unused implicit val correctionStatus: EnumType[CorrectionStatus] = CorrectionStatus.graphQLType

    deriveObjectType()
  }

}
