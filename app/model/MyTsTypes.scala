package model

import com.scalatsi.TypescriptType.{TSLiteralString, TSUnion}
import com.scalatsi.{TSIType, TSType}

object MyTsTypes {

  implicit val rightsType: TSType[Rights] = TSType.alias(
    "Rights",
    TSUnion {
      Rights.values.reverse.map(right => TSLiteralString(right.entryName))
    }
  )

  implicit val newExerciseInputType: TSIType[Exercise] = Exercise.tsType

  implicit val newUserSolutionInputType: TSIType[UserSolutionInput] = UserSolutionInput.tsType

  implicit val userSolutionNodeType: TSIType[SolutionNode] = SolutionNode.solutionNodeTsType

  implicit val correctionType: TSIType[Correction] = Correction.correctionType

}
