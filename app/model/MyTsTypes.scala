package model

import com.scalatsi.TSIType

object MyTsTypes {

  implicit val userSolutionNodeType: TSIType[SolutionNode] = SolutionNode.solutionNodeTsType

  implicit val correctionType: TSIType[SolutionNodeMatchingResult] = Correction.correctionType

}
