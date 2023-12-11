import { ReactElement } from 'react';
import { CurrentMatchFragment, RevSolNodeFragment } from '../graphql';
import { MatchingReviewNodeDisplay } from './MatchingReviewNodeDisplay';
import { partitionArray } from '../funcProg/arrays';

interface IProps {
  isSample: boolean;
  nodes: RevSolNodeFragment[];
  matches: CurrentMatchFragment[];
}

interface RecursiveInnerIProps extends IProps {
  depth: number;
  currentNode: RevSolNodeFragment;
}

function RecursiveInner({ isSample, depth, currentNode, nodes, matches }: RecursiveInnerIProps): ReactElement {

  const currentMatch = matches.find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === currentNode.id);

  const children = nodes
    .filter(({ parentId }) => parentId === currentNode.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  return (
    <>
      <div className="my-2" >
        <MatchingReviewNodeDisplay {...{ isSample, currentMatch, depth }} node={currentNode} />
      </div>

      {children.map((node) => <RecursiveInner key={node.id} depth={depth + 1} currentNode={node} {...{ isSample, nodes, matches }} />)}
    </>
  );
}

export function MatchingReviewSolutionDisplay({ isSample, nodes, matches }: IProps): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((node) => <RecursiveInner key={node.id} isSample={isSample} depth={0} currentNode={node} nodes={otherNodes} matches={matches} />)}
    </>
  );
}
