import { SolutionNodeFragment as SolNode } from "./graphql";

export function getFlatSolutionNodeChildren<Node extends SolNode>(allNodes: Node[], currentId: number | null): Node[] {
  return allNodes.filter(({ parentId }) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}
