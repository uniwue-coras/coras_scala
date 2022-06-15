// DO NOT EDIT: generated file by scala-tsi

export type DocxText = (IHeading | INormalText)

export interface IChangePasswordInput {
  oldPassword: string
  newPassword: string
  newPasswordRepeat: string
}

export interface IHeading {
  level: number
  text: string
  type: "Heading"
}

export interface ILoginInput {
  username: string
  password: string
}

export interface ILoginResult {
  username: string
  name?: string
  rights: ("Admin" | "Corrector" | "Student")
  jwt: string
}

export interface INewExerciseInput {
  title: string
  text: string
  sampleSolution: ISolutionNode[]
}

export interface INewUserSolutionInput {
  maybeUsername?: string
  solution: ISolutionNode[]
}

export interface INormalText {
  text: string
  type: "NormalText"
}

export interface IRegisterInput {
  username: string
  password: string
  passwordRepeat: string
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
