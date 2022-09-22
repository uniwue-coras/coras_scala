package model

import com.scalatsi.TypescriptType.TSEnum
import com.scalatsi.{TSIType, TSType}

object MyTsTypes {

  implicit val rightsType: TSType[Rights] = TSType(
    TSEnum.string(
      "Rights",
      Rights.values.map((rights) => (rights.entryName, rights.entryName)): _*
    )
  )

  implicit val userSolutionNodeType: TSIType[SolutionNode] = SolutionNode.solutionNodeTsType

  implicit val correctionType: TSIType[SolutionNodeMatchingResult] = Correction.correctionType

}
