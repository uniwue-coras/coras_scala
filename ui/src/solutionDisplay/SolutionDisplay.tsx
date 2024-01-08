import { ReactElement } from 'react';
import { SolutionNodeFragment } from '../graphql';
import { NodeDisplayProps, SolutionNodeDisplay } from './SolutionNodeDisplay';

export function SolutionDisplay<Node extends SolutionNodeFragment = SolutionNodeFragment>({ isSample, nodes, matches, children }: NodeDisplayProps<Node>): ReactElement {

  const rootNodes = nodes.filter(({ parentId }) => parentId === null || parentId === undefined);

  return (
    <>
      {rootNodes.map((node) => <SolutionNodeDisplay key={node.id} isSample={isSample} depth={0} node={node} nodes={nodes} matches={matches} >{children}</SolutionNodeDisplay>)}
    </>
  );
}
