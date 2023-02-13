import {Applicability, FlatSolutionNodeInput} from '../graphql';

export interface TreeNode<T extends TreeNode<T>> {
  children: T[];
}

export interface RawSolutionNode extends TreeNode<RawSolutionNode> {
  isSubText: boolean;
  text: string;
  applicability: Applicability;
}


export interface SolutionNode extends TreeNode<SolutionNode> {
  id: number;
  childIndex: number;
  isSubText: boolean;
  text: string;
  applicability: Applicability;
}

function enumerateEntriesInner(entries: RawSolutionNode[], currentMinIndex = 0): [SolutionNode[], number] {
  return entries.reduce<[SolutionNode[], number]>(
    ([acc, currentIndex], {text, applicability, isSubText, children: rawChildren}, childIndex) => {
      const [children, newIndex] = enumerateEntriesInner(rawChildren, currentIndex + 1);

      return [[...acc, {id: currentIndex, childIndex, text, applicability, isSubText, children}], newIndex];
    },
    [[], currentMinIndex]
  );
}

export function enumerateEntries(entries: RawSolutionNode[]): SolutionNode[] {
  return enumerateEntriesInner(entries)[0];
}

export function flattenNode({id, children, text, isSubText, childIndex, applicability}: SolutionNode, parentId: number | undefined): FlatSolutionNodeInput[] {
  return [
    {id, childIndex, text, isSubText, applicability, parentId},
    ...children.flatMap((n) => flattenNode(n, id))
  ];
}
