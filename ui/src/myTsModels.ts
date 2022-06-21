// DO NOT EDIT: generated file by scala-tsi

export type Applicability = ("NotSpecified" | "NotApplicable" | "Applicable");

export type DocxText = (IHeading | INormalText);

export interface ICorrectionValues {
  sampleSolution: ISolutionNode[];
  userSolution: ISolutionNode[];
}

export interface IExerciseInput {
  title: string;
  text: string;
  sampleSolution: ISolutionNode[];
}

export interface IHeading {
  level: number;
  text: string;
  type: "Heading";
}

export interface INormalText {
  text: string;
  type: "NormalText";
}

export interface ISolutionNode {
  id: number;
  childIndex: number;
  text: string;
  applicability: Applicability;
  subTexts: ISolutionNodeSubText[];
  children: ISolutionNode[];
}

export interface ISolutionNodeSubText {
  text: string;
  applicability: Applicability;
}

export interface IUserSolutionInput {
  maybeUsername?: string;
  solution: ISolutionNode[];
}
