package model

import com.scalatsi.TypescriptType.{TSLiteralString, TSUnion}
import com.scalatsi.{TSIType, TSType}

object MyTsTypes {

  implicit val rightsType: TSType[Rights] = TSType {
    TSUnion {
      Rights.values.reverse.map(right => TSLiteralString(right.entryName))
    }
  }

  implicit val newExerciseInputType: TSIType[Exercise] = Exercise.tsType

  implicit val newUserSolutionInputType: TSIType[UserSolutionInput] = UserSolutionInput.tsType

  implicit val userSolutionNodeType: TSIType[SolutionNode] = SolutionNode.tsType

}
