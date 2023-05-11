import {ColoredMatch} from './CorrectSolutionView';
import {IFlatSolutionNodeFragment} from '../graphql';
import {DragStatusProps} from './UserSolutionNodeDisplay';
import {MarkedNodeIdProps} from './SampleSolutionNodeDisplay';
import {MatchEditData} from './MatchEdit';

export interface NodeDisplayProps<N extends IFlatSolutionNodeFragment = IFlatSolutionNodeFragment> {
  matches: ColoredMatch[];
  currentNode: N;
  allNodes: N[];
  depth?: number;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
  matchEditData: MatchEditData | undefined;
}
