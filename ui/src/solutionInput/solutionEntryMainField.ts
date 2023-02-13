import {RawSolutionNode} from './solutionEntryNode';

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

export interface DeleteValues {
  deleteEntry: () => void;
  deletionDisabled?: boolean;
}

export interface TreeNodeFieldProps {
  entry: RawSolutionNode;
  name: string;
  index: number;
  depth: number;
  reduceValues: ReduceValues;
  moveValues?: MoveValues;
  addChild?: () => void;
  deleteValues?: DeleteValues;
}

