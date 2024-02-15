import { SolutionNodeFragment } from "./graphql";

export function getFlatSolutionNodeChildren<Node extends SolutionNodeFragment = SolutionNodeFragment>(allNodes: Node[], currentId: number | null): Node[] {
  return allNodes.filter(({ parentId }) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}
