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
