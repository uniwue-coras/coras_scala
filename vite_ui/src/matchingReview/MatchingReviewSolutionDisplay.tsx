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
}

interface RecursiveInnerIProps extends IProps {
  depth: number;
  currentNode: RevSolNodeFragment;
}

function RecursiveInner({ isSample, depth, currentNode, nodes, matches, matchCurrentlyExamined, onNodeClick }: RecursiveInnerIProps): ReactElement {

  const currentMatch = matches.find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === currentNode.id);

  const children = nodes.filter(({ parentId }) => parentId === currentNode.id);

  // make sure children are sorted...
  children.sort((a, b) => a.childIndex - b.childIndex);

  return (
    <>
      <div className="my-2" >
        <MatchingReviewNodeDisplay node={currentNode}  {...{ isSample, ownMatch: currentMatch, depth, matchCurrentlyExamined, onNodeClick }} />
      </div>

      {children.map((node) => <RecursiveInner key={node.id} depth={depth + 1} currentNode={node} {...{ isSample, nodes, matches, matchCurrentlyExamined, onNodeClick }} />)}
    </>
  );
}

export function MatchingReviewSolutionDisplay({ isSample, nodes, matches, matchCurrentlyExamined, onNodeClick }: IProps): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((currentNode) => <RecursiveInner key={currentNode.id} depth={0} nodes={otherNodes} {...{ currentNode, matches, isSample, onNodeClick, matchCurrentlyExamined }} />)}
    </>
  );
}
