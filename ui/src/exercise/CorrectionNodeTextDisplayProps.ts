import { SolutionNodeFragment, SolutionNodeMatchFragment } from '../graphql';
import { NodeTextDisplayProps } from '../solutionDisplay/SolutionNodeDisplay';
import { DragStatusProps } from './BasicNodeDisplay';
import { MatchEditData } from './matchEditData';
import { MarkedNodeIdProps } from './selectionState';

export interface CorrectionNodeTextDisplayProps<Node extends SolutionNodeFragment = SolutionNodeFragment> extends NodeTextDisplayProps<Node> {
  selectedNodeId: MarkedNodeIdProps;
  parentMatched: boolean;
  matches: SolutionNodeMatchFragment[];
  matchEditData: MatchEditData | undefined;
  dragProps: DragStatusProps;
  onClick: () => void;
}
