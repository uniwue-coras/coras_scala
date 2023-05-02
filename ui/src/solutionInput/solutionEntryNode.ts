import {Applicability, FlatSolutionNodeInput} from '../graphql';
import {IParagraphExtraction} from '../myTsModels';

export interface TreeNode<T extends TreeNode<T>> {
  children: T[];
}

export interface RawSolutionNode extends TreeNode<RawSolutionNode> {
  isSubText: boolean;
  text: string;
  applicability: Applicability;
  extractedParagraphs: IParagraphExtraction[];
}

export interface SolutionNode extends TreeNode<SolutionNode> {
  id: number;
  childIndex: number;
  isSubText: boolean;
  text: string;
  applicability: Applicability;
  extractedParagraphs: IParagraphExtraction[];
}

const enumerateEntriesInner = (entries: RawSolutionNode[], currentMinIndex = 0): [SolutionNode[], number] => entries.reduce<[SolutionNode[], number]>(
  ([acc, currentIndex], {text, applicability, isSubText, children: rawChildren, extractedParagraphs}, childIndex) => {
    const [children, newIndex] = enumerateEntriesInner(rawChildren, currentIndex + 1);

    return [[...acc, {id: currentIndex, childIndex, text, applicability, isSubText, children, extractedParagraphs}], newIndex];
  },
  [[], currentMinIndex]
);

export const enumerateEntries = (entries: RawSolutionNode[]): SolutionNode[] => enumerateEntriesInner(entries)[0];

export function flattenNode({
  id,
  children,
  text,
  isSubText,
  childIndex,
  applicability,
  extractedParagraphs
}: SolutionNode, parentId: number | undefined): FlatSolutionNodeInput[] {
  return [
    {id, childIndex, text, isSubText, applicability, parentId},
    ...children.flatMap((n) => flattenNode(n, id))
  ];
}
