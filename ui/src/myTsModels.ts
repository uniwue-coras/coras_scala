// DO NOT EDIT: generated file by scala-tsi

export type Applicability = ("NotSpecified" | "NotApplicable" | "Applicable");

export type DocxText = (IHeading | INormalText);

export interface ICorrection {
  rootMatchingResult: ISolutionNodeMatchingResult;
}

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

export interface IMatchedSolutionNode {
  id: number;
  text: string;
  applicability: Applicability;
  subTexts: ISolutionNodeSubText[];
}

export interface INodeCorrectionMatch {
  sampleValue: IMatchedSolutionNode;
  userValue: IMatchedSolutionNode;
  childMatches: ISolutionNodeMatchingResult;
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

export interface ISolutionNodeMatchingResult {
  matches: INodeCorrectionMatch[];
  notMatchedSample: ISolutionNode[];
  notMatchedUser: ISolutionNode[];
}

export interface ISolutionNodeSubText {
  text: string;
  applicability: Applicability;
}

export interface IUserSolutionInput {
  maybeUsername?: string;
  solution: ISolutionNode[];
}
