import { ReactElement } from 'react';
import { SolutionNodeMatchFragment, SolutionNodeFragment } from './graphql';
import { partitionArray } from './funcProg/array.extensions';
import { BasicNodeDisplayProps, NodeDisplayProps } from './exercise/nodeDisplayProps';

interface IProps<N extends SolutionNodeFragment> {
  isSample: boolean;
  allNodes: N[];
  allMatches: SolutionNodeMatchFragment[];
  children: (props: NodeDisplayProps<N>) => ReactElement;
}

export function RecursiveSolutionNodeDisplay<N extends SolutionNodeFragment>({ allNodes, ...otherProps }: IProps<N>): ReactElement {

  const rootNodes = allNodes.filter(({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((node, index) => <RecursiveInner key={node.id} node={node} depth={0} index={index} allNodes={allNodes} {...otherProps} />)}
    </>
  );
}

type RecursiveInnerIProps<N extends SolutionNodeFragment> = BasicNodeDisplayProps<N> & IProps<N>;

function RecursiveInner<N extends SolutionNodeFragment>({ isSample, allNodes, allMatches, index, depth, node, children }: RecursiveInnerIProps<N>): ReactElement {

  const childNodes = allNodes
    .filter(({ parentId }) => parentId === node.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  const [subTextNodes, realChildNodes] = partitionArray(childNodes, ({ isSubText }) => isSubText);

  const ownMatches = allMatches.filter(({ sampleNodeId, userNodeId }) => node.id === (isSample ? sampleNodeId : userNodeId));

  return (
    <>
      <div className="my-2">
        {children({ node, index, depth, ownMatches })}
      </div>

      {subTextNodes.map((subTextNode, index) => <RecursiveInner key={subTextNode.id} index={index} depth={depth + 1} node={subTextNode} {...{ isSample, allNodes, allMatches, children }} />)}

      {realChildNodes.map((realChildNode, index) => <RecursiveInner key={realChildNode.id + subTextNodes.length} index={index} depth={depth + 1} node={realChildNode} {...{ isSample, allNodes, allMatches, children }} />)}
    </>
  );
}
