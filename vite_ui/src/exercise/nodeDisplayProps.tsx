import { SolutionNodeMatchFragment, SolutionNodeFragment } from '../graphql';

export interface BasicNodeDisplayProps<N extends SolutionNodeFragment> {
  node: N;
  index: number;
  depth: number;
}

export interface NodeDisplayProps<N extends SolutionNodeFragment = SolutionNodeFragment> extends BasicNodeDisplayProps<N> {
  ownMatches: SolutionNodeMatchFragment[];
}

export interface CorrectionNodeDisplayProps<N extends SolutionNodeFragment = SolutionNodeFragment> extends NodeDisplayProps<N> {
  onNodeClick: (id?: number | undefined) => void;
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

