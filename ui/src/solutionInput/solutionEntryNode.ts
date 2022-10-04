import {Applicability, FlatSolutionNodeInput} from '../graphql';

export interface TreeNode<T extends TreeNode<T>> {
  children: T[];
}

export interface RawSolutionEntry extends TreeNode<RawSolutionEntry> {
  text: string;
  applicability: Applicability;
  subTexts: SolutionNodeSubText[];
}

interface SolutionNodeSubText {
  id: number;
  text: string;
}

export interface SolutionNode extends TreeNode<SolutionNode> {
  id: number;
  childIndex: number;
  text: string;
  applicability: Applicability;
  subTexts: SolutionNodeSubText[];
}

function enumerateEntriesInner(entries: RawSolutionEntry[], currentMinIndex = 0): [SolutionNode[], number] {
  return entries.reduce<[SolutionNode[], number]>(
    ([acc, currentIndex], {text, applicability, subTexts, children: rawChildren}, childIndex) => {
      const [children, newIndex] = enumerateEntriesInner(rawChildren, currentIndex + 1);

      return [[...acc, {id: currentIndex, childIndex, text, applicability, subTexts, children}], newIndex];
    },
    [[], currentMinIndex]
  );
}

export function enumerateEntries(entries: RawSolutionEntry[]): SolutionNode[] {
  return enumerateEntriesInner(entries)[0];
}

export function flattenNode({id, children, text, subTexts, childIndex, applicability}: SolutionNode, parentId: number | undefined): FlatSolutionNodeInput[] {
  return [
    {id, childIndex, text, subTexts, applicability, parentId},
    ...children.flatMap((n) => flattenNode(n, id))
  ];
}
