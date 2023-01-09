import {MarkedNodeIdProps} from './UserSolutionNodeDisplay';

export const enum SelectionState {
  None,
  This,
  Match,
  Other
}

export function getSelectionState({nodeId: selectedNodeId, matchingNodeIds}: MarkedNodeIdProps, nodeId: number): SelectionState {
  if (selectedNodeId !== undefined) {
    return selectedNodeId === nodeId
      ? SelectionState.This
      : SelectionState.Other;
  } else if (matchingNodeIds === undefined) {
    return SelectionState.None;
  } else {
    return matchingNodeIds.includes(nodeId)
      ? SelectionState.Match
      : SelectionState.Other;
  }
}
