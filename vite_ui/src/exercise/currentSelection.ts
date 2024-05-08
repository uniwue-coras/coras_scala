import { AnnotationImportance, AnnotationInput, ErrorType } from '../graphql';

export interface CreateOrEditAnnotationData {
  nodeId: number;
  maybeAnnotationId: number | undefined;
  annotationInput: AnnotationInput;
  maxEndOffset: number;
}

export function annotationInput(errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string): AnnotationInput {
  return { errorType, importance, startIndex, endIndex, text };
}

export function createOrEditAnnotationData(nodeId: number, maybeAnnotationId: number | undefined, annotationInput: AnnotationInput, maxEndOffset: number): CreateOrEditAnnotationData {
  return { nodeId, maybeAnnotationId, annotationInput, maxEndOffset };
}
