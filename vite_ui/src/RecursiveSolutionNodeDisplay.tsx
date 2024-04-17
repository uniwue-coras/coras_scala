import { ReactElement } from 'react';
import { SolutionNodeFragment } from './graphql';
import { partitionArray } from './funcProg/array.extensions';
import { BasicNodeDisplayProps, NodeDisplayProps } from './exercise/nodeDisplayProps';
import { MinimalSolutionNodeMatch } from './minimalSolutionNodeMatch';

interface IProps<N extends SolutionNodeFragment, M extends MinimalSolutionNodeMatch> {
  isSample: boolean;
  allNodes: N[];
  allMatches: M[];
  children: (props: NodeDisplayProps<N, M>) => ReactElement;
}

export function RecursiveSolutionNodeDisplay<N extends SolutionNodeFragment, M extends MinimalSolutionNodeMatch>({ allNodes, ...otherProps }: IProps<N, M>): ReactElement {

  const rootNodes = allNodes.filter(({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((node, index) => <RecursiveInner key={node.id} node={node} depth={0} index={index} allNodes={allNodes} {...otherProps} />)}
    </>
  );
}

type RecursiveInnerIProps<N extends SolutionNodeFragment, M extends MinimalSolutionNodeMatch> = BasicNodeDisplayProps<N> & IProps<N, M>;

export const indentInPixel = 20;

function RecursiveInner<N extends SolutionNodeFragment, M extends MinimalSolutionNodeMatch>({ isSample, allNodes, allMatches, index, depth, node, children }: RecursiveInnerIProps<N, M>): ReactElement {

  const childNodes = allNodes
    .filter(({ parentId }) => parentId === node.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  const [subTextNodes, realChildNodes] = partitionArray(childNodes, ({ isSubText }) => isSubText);

  const ownMatches = allMatches.filter(({ sampleNodeId, userNodeId }) => node.id === (isSample ? sampleNodeId : userNodeId))

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
