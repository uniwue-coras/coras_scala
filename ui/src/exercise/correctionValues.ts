import {Applicability} from '../graphql';

/*
export enum Applicability {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable',
  NotSpecified = 'NotSpecified'
}
 */

export interface ApplicableText {
  text: string;
  applicability: Applicability;
}

export interface ISolutionNode extends ApplicableText {
  id: number;
  childIndex: number;
  subTexts: ApplicableText[];
  children: ISolutionNode[];
}

export interface CorrectionValues {
  sampleSolution: ISolutionNode[];
  userSolution: ISolutionNode[];
}