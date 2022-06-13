// DO NOT EDIT: generated file by scala-tsi

export type DocxText = (IHeading | INormalText)

export interface IHeading {
  level: number
  text: string
  type: "Heading"
}

export interface INewExerciseInput {
  title: string
  text: string
  sampleSolution: ISolutionNode[]
}

export interface INormalText {
  text: string
  type: "NormalText"
}

export interface ISolutionNode {
  id: number
  text: string
  applicability: ("NotSpecified" | "NotApplicable" | "Applicable")
  subTexts: ISolutionNodeSubText[]
  children: ISolutionNode[]
}

export interface ISolutionNodeSubText {
  text: string
  applicability: ("NotSpecified" | "NotApplicable" | "Applicable")
}
