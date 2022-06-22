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

  implicit val userSolutionNodeType: TSIType[SolutionNode] = SolutionNode.solutionNodeTsType

  implicit val correctionType: TSIType[SolutionNodeMatchingResult] = Correction.correctionType

}
