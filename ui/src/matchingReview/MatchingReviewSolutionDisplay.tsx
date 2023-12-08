import { ReactElement } from 'react';
import { RevSolNodeFragment } from '../graphql';
import { MatchingReviewNodeDisplay } from './MatchingReviewNodeDisplay';
import { partitionArray } from '../funcProg/arrays';

interface IProps {
  nodes: RevSolNodeFragment[];
}

interface RecursiveInnerIProps extends IProps {
  depth: number;
  currentNode: RevSolNodeFragment;
}

function RecursiveInner({ nodes, depth, currentNode }: RecursiveInnerIProps): ReactElement {

  const children = nodes.filter(({ parentId }) => parentId === currentNode.id);

  return (
    <>
      <div className="my-2" style={{ marginLeft: `${depth * 20}px` }}>
        <MatchingReviewNodeDisplay depth={depth} node={currentNode} />
      </div>
      {children.map((node) => <RecursiveInner key={node.id} nodes={nodes} depth={depth + 1} currentNode={node} />)}
    </>
  );
}



export function MatchingReviewSolutionDisplay({ nodes }: IProps): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <div>
      {rootNodes.map((node) => <RecursiveInner key={node.id} nodes={otherNodes} depth={0} currentNode={node} />)}
    </div>
  );

}
