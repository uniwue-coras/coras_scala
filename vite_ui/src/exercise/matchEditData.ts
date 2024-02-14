import { CorrectSolutionViewState, SideSelector } from './CorrectSolutionView';
import { SolutionNodeFragment, SolutionNodeMatchFragment } from '../graphql';

export interface MatchEditData {
  markedNodeSide: SideSelector;
  markedNode: SolutionNodeFragment;
  matches: [SolutionNodeMatchFragment, SolutionNodeFragment][];
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
}

export function getMatchEditData(state: CorrectSolutionViewState, sampleSolution: SolutionNodeFragment[], onDeleteMatch: (sampleValue: number, userValue: number) => void): MatchEditData | undefined {
  if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
    return undefined;
  }

  const { matches: allMatches, currentSelection: { side: markedNodeSide, nodeId } } = state;

  const markedNode = markedNodeSide === SideSelector.Sample
    ? sampleSolution.find(({ id }) => id === nodeId)
    : state.userSolution.find(({ id }) => id === nodeId);

  if (markedNode === undefined) {
    return undefined;
  }

  const matches: [SolutionNodeMatchFragment, SolutionNodeFragment][] = allMatches
    .filter(({ sampleNodeId, userNodeId }) => nodeId === (markedNodeSide === SideSelector.Sample ? sampleNodeId : userNodeId))
    .flatMap((aMatch) => {
      const matchedNode = markedNodeSide === SideSelector.Sample
        ? state.userSolution.find(({ id }) => id === aMatch.userNodeId)
        : sampleSolution.find(({ id }) => id === aMatch.sampleNodeId);

      return matchedNode !== undefined
        ? [[aMatch, matchedNode]]
        : [];
    });

  if (matches.length === 0) {
    return undefined;
  }

  return { markedNodeSide, markedNode, matches, onDeleteMatch };
}
