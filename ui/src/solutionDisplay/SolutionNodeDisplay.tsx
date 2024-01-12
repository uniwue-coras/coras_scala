import { ReactElement } from 'react';
import { ISolutionNodeMatchFragment } from '../graphql';
import { SolNode, getChildNodes } from './solutionNode';

export interface NodeTextDisplayProps<Node extends SolNode = SolNode> {
  node: Node;
  depth: number;
  ownMatch: ISolutionNodeMatchFragment | undefined;
}

export interface NodeDisplayProps<Node extends SolNode = SolNode> {
  isSample: boolean;
  nodes: Node[];
  matches: ISolutionNodeMatchFragment[];
  children: (p: NodeTextDisplayProps<Node>) => ReactElement;
  displaySubTexts: (node: Node) => ReactElement;
}

interface IProps<Node extends SolNode = SolNode> extends NodeDisplayProps<Node> {
  node: Node;
  depth: number;
}

export function SolutionNodeDisplay<Node extends SolNode = SolNode>({ isSample, node, nodes, matches, depth, children, displaySubTexts }: IProps<Node>): ReactElement {

  // find current match (if any...)
  const ownMatch = matches.find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === node.id);

  const childNodes = getChildNodes(node.id, nodes);

  return (
    <div className="my-2">
      {children({ node, depth, ownMatch })}

      <div className="ml-16">
        {displaySubTexts && displaySubTexts(node)}

        {childNodes.map((childNode) => <SolutionNodeDisplay key={childNode.id} depth={depth + 1} node={childNode}
          {...{ isSample, nodes, matches, children, displaySubTexts }} />)}
      </div>
    </div>
  );


}
