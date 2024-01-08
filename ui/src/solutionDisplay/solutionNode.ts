import { SolutionNodeFragment } from '../graphql';

export type SolNode = SolutionNodeFragment;

export function getRootNodes<Node extends SolNode = SolNode>(nodes: Node[]): Node[] {
  return nodes.filter(({ parentId }) => parentId === null || parentId === undefined);
}

export function getChildNodes<Node extends SolNode = SolNode>(nodeId: number, nodes: Node[]): Node[] {
  return nodes
    .filter(({ parentId }) => parentId === nodeId)
    .toSorted((a, b) => a.childIndex - b.childIndex);
}
