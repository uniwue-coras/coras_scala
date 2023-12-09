import { ReactElement } from 'react';
import { GoldStandardMatchFragment, RevSolNodeFragment } from '../graphql';
import { MatchingReviewNodeDisplay } from './MatchingReviewNodeDisplay';
import { partitionArray } from '../funcProg/arrays';
import { allMatchColors } from '../allMatchColors';

interface IProps {
  isSample: boolean;
  nodes: RevSolNodeFragment[];
  matches: GoldStandardMatchFragment[];
}

interface RecursiveInnerIProps extends IProps {
  depth: number;
  currentNode: RevSolNodeFragment;
}

const indentInPixel = 20;

function RecursiveInner({ isSample, depth, currentNode, nodes, matches }: RecursiveInnerIProps): ReactElement {

  const currentMatch = matches.find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === currentNode.id);

  const matchColor = currentMatch
    ? allMatchColors[currentMatch.sampleNodeId]
    : undefined;

  const children = nodes
    .filter(({ parentId }) => parentId === currentNode.id)
    .toSorted((a, b) => a.childIndex - b.childIndex);

  return (
    <>
      <div className="my-2" style={{ marginLeft: `${depth * indentInPixel}px` }}>
        <MatchingReviewNodeDisplay matchColor={matchColor} depth={depth} node={currentNode} />
        {currentMatch && <div className="text-center italic">
          {currentMatch.explanation
            ? <div>{JSON.stringify(currentMatch.explanation)}</div>
            : <div>Equality!</div>
          }</div>}
      </div>

      {children.map((node) => <RecursiveInner key={node.id} depth={depth + 1} currentNode={node} {...{ isSample, nodes, matches }} />)}
    </>
  );
}

export function MatchingReviewSolutionDisplay({ isSample, nodes, matches }: IProps): ReactElement {

  const [rootNodes, otherNodes] = partitionArray(nodes, ({ parentId }) => parentId === null || parentId === undefined);

  return (
    <div>
      {rootNodes.map((node) => <RecursiveInner key={node.id} isSample={isSample} depth={0} currentNode={node} nodes={otherNodes} matches={matches} />)}
    </div>
  );
}
