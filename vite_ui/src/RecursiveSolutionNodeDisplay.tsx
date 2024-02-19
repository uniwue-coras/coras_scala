import { ReactElement } from 'react';
import { SolutionNodeFragment } from './graphql';
import { partitionArray } from './funcProg/array.extensions';

interface IProps<Node extends SolutionNodeFragment> {
  nodes: Node[];
  children: (node: Node, depth: number) => ReactElement;
}

interface RecursiveInnerIProps<Node extends SolutionNodeFragment> extends IProps<Node> {
  depth: number;
  currentNode: Node;
}

function RecursiveInner<Node extends SolutionNodeFragment>({ nodes, depth, currentNode, children }: RecursiveInnerIProps<Node>): ReactElement {

  const childNodes = nodes
    .filter(({ parentId }) => parentId === currentNode.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  return (
    <>
      <div className="my-2" >
        {children(currentNode, depth)}
      </div>

      {childNodes.map((node) => <RecursiveInner key={node.id} depth={depth + 1} currentNode={node} {...{ nodes, children }} />)}
    </>
  );
}

export function RecursiveSolutionNodeDisplay<Node extends SolutionNodeFragment>({ nodes, ...otherProps }: IProps<Node>): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((currentNode) => <RecursiveInner key={currentNode.id} depth={0} nodes={otherNodes} {...{ currentNode, ...otherProps }} />)}
    </>
  );
}
