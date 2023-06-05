import {CorrectSolutionViewState, SideSelector} from './CorrectSolutionView';
import {IFlatSolutionNodeFragment, SolutionNodeMatchFragment} from '../graphql';

export interface MatchEditData {
  markedNodeSide: SideSelector;
  markedNode: IFlatSolutionNodeFragment;
  matches: [SolutionNodeMatchFragment, IFlatSolutionNodeFragment][];
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
}

export function getMatchEditData(state: CorrectSolutionViewState, sampleSolution: IFlatSolutionNodeFragment[], onDeleteMatch: (sampleValue: number, userValue: number) => void): MatchEditData | undefined {
  if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
    return undefined;
  }

  const {matches: allMatches, currentSelection: {side: markedNodeSide, nodeId}} = state;

  const markedNode = markedNodeSide === SideSelector.Sample
    ? sampleSolution.find(({id}) => id === nodeId)
    : state.userSolution.find(({id}) => id === nodeId);

  if (markedNode === undefined) {
    return undefined;
  }

  const matches: [SolutionNodeMatchFragment, IFlatSolutionNodeFragment][] = allMatches
    .filter(({sampleValue, userValue}) => nodeId === (markedNodeSide === SideSelector.Sample ? sampleValue : userValue))
    .flatMap((aMatch) => {
      const matchedNode = markedNodeSide === SideSelector.Sample
        ? state.userSolution.find(({id}) => id === aMatch.userValue)
        : sampleSolution.find(({id}) => id === aMatch.sampleValue);

      return matchedNode !== undefined
        ? [[aMatch, matchedNode]]
        : [];
    });

  if (matches.length === 0) {
    return undefined;
  }

  return {markedNodeSide, markedNode, matches, onDeleteMatch};
}
