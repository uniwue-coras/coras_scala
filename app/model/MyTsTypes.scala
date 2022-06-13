package model

import com.scalatsi.TSIType

object MyTsTypes {

  implicit val newExerciseInputType: TSIType[NewExerciseInput] = NewExerciseInput.tsType

}
