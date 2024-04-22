import { ISolutionNodeMatchFragment, SolutionNodeFragment } from '../graphql';
import { MatchEditData } from './matchEditData';

type INode = SolutionNodeFragment;

export interface BasicNodeDisplayProps<N extends SolutionNodeFragment> {
  node: N;
  index: number;
  depth: number;
}

export interface NodeDisplayProps<N extends INode = INode> extends BasicNodeDisplayProps<N> {
  ownMatches: ISolutionNodeMatchFragment[];
}

export interface CorrectionNodeDisplayProps<N extends INode = INode> extends NodeDisplayProps<N> {
  matchEditData: MatchEditData | undefined;
  onNodeClick: (id?: number | undefined) => void;
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

