import { AnnotationImportance, AnnotationInput, ErrorType } from '../graphql';
import { SideSelector } from './SideSelector';

export interface MatchSelection {
  _type: 'MatchSelection';
  side: SideSelector;
  nodeId: number;
}

export function matchSelection(side: SideSelector, nodeId: number): MatchSelection {
  return { _type: 'MatchSelection', side, nodeId };
}

export interface CreateOrEditAnnotationData {
  _type: 'CreateOrEditAnnotationData';
  nodeId: number;
  maybeAnnotationId: number | undefined;
  annotationInput: AnnotationInput;
  maxEndOffset: number;
  textRecommendations: string[] | undefined;
}

export function annotationInput(errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string): AnnotationInput {
  return { errorType, importance, startIndex, endIndex, text };
}

export function createOrEditAnnotationData(nodeId: number, maybeAnnotationId: number | undefined, annotationInput: AnnotationInput, maxEndOffset: number): CreateOrEditAnnotationData {
  return { _type: 'CreateOrEditAnnotationData', nodeId, maybeAnnotationId, annotationInput, maxEndOffset, textRecommendations: undefined };
}

export type CurrentSelection = MatchSelection | CreateOrEditAnnotationData;
