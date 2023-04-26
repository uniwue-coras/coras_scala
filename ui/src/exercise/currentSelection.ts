import {AnnotationInput, ErrorType} from '../graphql';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';

export interface MatchSelection {
  _type: 'MatchSelection';
  side: SideSelector;
  nodeId: number;
}

export function matchSelection(side: SideSelector, nodeId: number): MatchSelection {
  return {_type: 'MatchSelection', side, nodeId};
}

export interface CreateOrEditAnnotationData {
  _type: 'CreateOrEditAnnotationData';
  nodeId: number;
  maybeAnnotationId: number | undefined;
  annotationInput: AnnotationInput;
  maxEndOffset: number;
}

export function annotationInput(errorType: ErrorType, startIndex: number, endIndex: number, text: string): AnnotationInput {
  return {errorType, startIndex, endIndex, text};
}

export function createOrEditAnnotationData(nodeId: number, maybeAnnotationId: number | undefined, annotationInput: AnnotationInput, maxEndOffset: number): CreateOrEditAnnotationData {
  return {_type: 'CreateOrEditAnnotationData', nodeId, maybeAnnotationId, annotationInput, maxEndOffset};
}

export type CurrentSelection = MatchSelection | CreateOrEditAnnotationData;
