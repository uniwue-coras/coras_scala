import { ReactElement } from 'react';
import { SolutionNodeFragment } from './graphql';
import { partitionArray } from './funcProg/array.extensions';

export interface BasicNodeDisplayProps<Node extends SolutionNodeFragment> {
  node: Node;
  index: number;
  depth: number;
}

interface IProps<Node extends SolutionNodeFragment> {
  nodes: Node[];
  children: (props: BasicNodeDisplayProps<Node>) => ReactElement;
}

export function RecursiveSolutionNodeDisplay<Node extends SolutionNodeFragment>({ nodes, ...otherProps }: IProps<Node>): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((currentNode, index) => <RecursiveInner key={currentNode.id} depth={0} index={index} nodes={otherNodes} {...{ node: currentNode, ...otherProps }} />)}
    </>
  );
}

interface RecursiveInnerIProps<Node extends SolutionNodeFragment> extends IProps<Node> {
  depth: number;
  index: number;
  node: Node;
}

function RecursiveInner<Node extends SolutionNodeFragment>({ nodes, index, depth, node, children }: RecursiveInnerIProps<Node>): ReactElement {

  const childNodes = nodes
    .filter(({ parentId }) => parentId === node.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  const [subTextNodes, realChildNodes] = partitionArray(childNodes, ({ isSubText }) => isSubText);

  return (
    <>
      <div className="my-2" >
        {children({ node, index, depth })}
      </div>

      {subTextNodes.map((subTextNode, index) => <RecursiveInner key={subTextNode.id} index={index} depth={depth + 1} node={subTextNode} {...{ nodes, children }} />)}

      {realChildNodes.map((realChildNode, index) => <RecursiveInner key={realChildNode.id + subTextNodes.length} index={index} depth={depth + 1} node={realChildNode} {...{ nodes, children }} />)}
    </>
  );
}
