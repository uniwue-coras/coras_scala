import { SolutionNodeFragment } from '../graphql';
import { MinimalSolutionNodeMatch } from '../minimalSolutionNodeMatch';
import { MatchEditData } from './matchEditData';

type INode = SolutionNodeFragment;

export interface BasicNodeDisplayProps<N extends SolutionNodeFragment> {
  node: N;
  index: number;
  depth: number;
}

export interface NodeDisplayProps<N extends INode = INode, M extends MinimalSolutionNodeMatch = MinimalSolutionNodeMatch> extends BasicNodeDisplayProps<N> {
  ownMatches: M[];
}

export interface CorrectionNodeDisplayProps<N extends INode = INode> extends NodeDisplayProps<N> {
  matchEditData: MatchEditData | undefined;
  onNodeClick: (id?: number | undefined) => void;
  onDrop: (sampleId: number, userId: number) => Promise<void>;
}

