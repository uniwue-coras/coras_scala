import {RawSolutionEntry} from './solutionEntryNode';
import {ArrayHelpers} from 'formik';

export interface ReduceValues {
  isReducible?: boolean;
  isReduced: boolean;
  toggleIsReduced: () => void;
}

export interface MoveValues {
  moveUp: () => void;
  moveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function buildMoveValues<T>(index: number, entries: T[], arrayHelpers: ArrayHelpers): MoveValues {

  const isFirst = index === 0;
  const isLast = index === entries.length - 1;

  return {
    moveUp: () => !isFirst && arrayHelpers.swap(index, index - 1),
    moveDown: () => !isLast && arrayHelpers.swap(index, index + 1),
    isFirst, isLast
  };
}


export interface DeleteValues {
  deleteEntry: () => void;
  deletionDisabled?: boolean;
}

export interface TreeNodeFieldProps {
  entry: RawSolutionEntry;
  name: string;
  index: number;
  depth: number;
  reduceValues: ReduceValues;
  moveValues?: MoveValues;
  addChild?: () => void;
  deleteValues?: DeleteValues;
}

