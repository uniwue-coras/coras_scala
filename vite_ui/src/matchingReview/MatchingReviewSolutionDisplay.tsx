import { ReactElement } from 'react';
import { CurrentMatchFragment, RevSolNodeFragment } from '../graphql';
import { MatchingReviewNodeDisplay } from './MatchingReviewNodeDisplay';
import { partitionArray } from '../funcProg/array.extensions';

interface IProps {
  isSample: boolean;
  matchCurrentlyExamined: CurrentMatchFragment | undefined;
  onNodeClick: (isSample: boolean, nodeId: number) => void;
  nodes: RevSolNodeFragment[];
  matches: CurrentMatchFragment[];
  onDragDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

interface RecursiveInnerIProps extends IProps {
  depth: number;
  currentNode: RevSolNodeFragment;
}

function RecursiveInner({ isSample, depth, currentNode, nodes, matches, ...otherProps }: RecursiveInnerIProps): ReactElement {

  const currentMatch = matches.find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === currentNode.id);

  const children = nodes
    .filter(({ parentId }) => parentId === currentNode.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  return (
    <>
      <div className="my-2" >
        <MatchingReviewNodeDisplay node={currentNode}  {...{ isSample, ownMatch: currentMatch, depth, ...otherProps }} />
      </div>

      {children.map((node) => <RecursiveInner key={node.id} depth={depth + 1} currentNode={node} {...{ isSample, nodes, matches, ...otherProps }} />)}
    </>
  );
}

export function MatchingReviewSolutionDisplay({ nodes, ...otherProps }: IProps): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((currentNode) => <RecursiveInner key={currentNode.id} depth={0} nodes={otherNodes} {...{ currentNode, ...otherProps }} />)}
    </>
  );
}
