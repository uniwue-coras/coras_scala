package model

import com.scalatsi.TypescriptType.{TSLiteralString, TSUnion}
import com.scalatsi.{TSIType, TSType}

object MyTsTypes {

  implicit val rightsType: TSType[Rights] = TSType {
    TSUnion {
      Rights.values.reverse.map(right => TSLiteralString(right.entryName))
    }
  }

  implicit val newExerciseInputType: TSIType[NewExerciseInput] = NewExerciseInput.tsType

  implicit val newUserSolutionInputType: TSIType[NewUserSolutionInput] = NewUserSolutionInput.tsType

}
