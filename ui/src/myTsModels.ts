// DO NOT EDIT: generated file by scala-tsi

import {Applicability} from './graphql';

export type DocxText = (IHeading | INormalText);

export interface IHeading {
  level: number;
  text: string;
  type: 'Heading';
}

export interface INormalText {
  text: string;
  type: 'NormalText';
}

export interface ISolutionMatchComment {
  startIndex: number;
  endIndex: number;
  comment: string;
}

export interface ISolutionNode {
  id: number;
  childIndex: number;
  text: string;
  applicability: Applicability;
  subTexts: ISolutionNodeSubText[];
  children: ISolutionNode[];
}

export interface ISolutionNodeMatch {
  sampleValue: ISolutionNode;
  userValue: ISolutionNode;
  childMatches: ISolutionNodeMatchingResult;
  comments: ISolutionMatchComment[];
}

export interface ISolutionNodeMatchingResult {
  matches: ISolutionNodeMatch[];
  notMatchedSample: ISolutionNode[];
  notMatchedUser: ISolutionNode[];
}

export interface ISolutionNodeSubText {
  text: string;
  applicability: Applicability;
}
