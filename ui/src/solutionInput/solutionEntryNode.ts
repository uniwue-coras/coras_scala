import {TreeNode} from './treeNode';
import {ISolutionNode} from '../myTsModels';
import {ApplicableText} from '../model/applicability';
import {Applicability, FlatSolutionNodeInput} from '../graphql';

export interface RawSolutionEntry extends TreeNode<RawSolutionEntry> {
  text: string;
  applicability: Applicability;
  subTexts: ApplicableText[];
}

function enumerateEntriesInner(entries: RawSolutionEntry[], currentMinIndex = 0): [ISolutionNode[], number] {
  return entries.reduce<[ISolutionNode[], number]>(
    ([acc, currentIndex], {text, applicability, subTexts, children: rawChildren}, childIndex) => {
      const [children, newIndex] = enumerateEntriesInner(rawChildren, currentIndex + 1);

      return [[...acc, {id: currentIndex, childIndex, text, applicability, subTexts, children}], newIndex];
    },
    [[], currentMinIndex]
  );
}

export function enumerateEntries(entries: RawSolutionEntry[]): ISolutionNode[] {
  return enumerateEntriesInner(entries)[0];
}

export function flattenNode({id, children, text, subTexts, childIndex, applicability}: ISolutionNode, parentId: number | undefined): FlatSolutionNodeInput[] {
  return [
    {id, childIndex, text, subTexts, applicability, parentId},
    ...children.flatMap((n) => flattenNode(n, id))
  ];
}
