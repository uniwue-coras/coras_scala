import { Applicability, Importance, SolutionNodeInput } from '../graphql';

interface TreeNode<T extends TreeNode<T>> {
  children: T[];
}

export interface RawSolutionNode extends TreeNode<RawSolutionNode> {
  isSubText: boolean;
  text: string;
  applicability: Applicability;
  focusIntensity: Importance | undefined;
}

interface SolutionNode extends TreeNode<SolutionNode> {
  id: number;
  childIndex: number;
  isSubText: boolean;
  text: string;
  applicability: Applicability;
  focusIntensity: Importance | undefined;
}

const enumerateEntriesInner = (entries: RawSolutionNode[], currentMinIndex = 0): [SolutionNode[], number] => entries.reduce<[SolutionNode[], number]>(
  ([acc, currentIndex], { text, isSubText, applicability, focusIntensity, children: rawChildren }, childIndex) => {
    const [children, newIndex] = enumerateEntriesInner(rawChildren, currentIndex + 1);

    return [[...acc, { id: currentIndex, childIndex, isSubText, text, applicability, focusIntensity, children }], newIndex];
  },
  [[], currentMinIndex]
);

const enumerateEntries = (entries: RawSolutionNode[]): SolutionNode[] => enumerateEntriesInner(entries)[0];

const flattenNode = (
  { id, childIndex, isSubText, text, applicability, focusIntensity, children }: SolutionNode,
  parentId: number | undefined = undefined
): SolutionNodeInput[] => [{ id, childIndex, isSubText, text, applicability, focusIntensity, parentId }, ...children.flatMap((n) => flattenNode(n, id))];


export function convertEntries(rawNodes: RawSolutionNode[]): SolutionNodeInput[] {
  return enumerateEntries(rawNodes).flatMap((n) => flattenNode(n));
}
