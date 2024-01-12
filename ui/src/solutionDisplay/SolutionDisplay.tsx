import { ReactElement } from 'react';
import { NodeDisplayProps, SolutionNodeDisplay } from './SolutionNodeDisplay';
import { SolNode, getRootNodes } from './solutionNode';

export function SolutionDisplay<Node extends SolNode = SolNode>({ nodes, children, ...rest }: NodeDisplayProps<Node>): ReactElement {
  return (
    <>
      {getRootNodes(nodes).map((node) => <SolutionNodeDisplay key={node.id} depth={0} node={node} nodes={nodes} {...rest}>
        {children}
      </SolutionNodeDisplay>)}
    </>
  );
}
