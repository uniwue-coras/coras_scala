import {TreeNode} from './treeNode';
import {Applicability, ISolutionNode} from '../myTsModels';
import {ApplicableText} from '../model/applicability';

export interface RawSolutionEntry extends TreeNode<RawSolutionEntry> {
  text: string;
  applicability: Applicability;
  subTexts: ApplicableText[];
}

export function enumerateEntries(entries: RawSolutionEntry[], currentMinIndex = 0): [ISolutionNode[], number] {

  return entries.reduce<[ISolutionNode[], number]>(
    ([acc, currentIndex], {text, applicability, subTexts, children: rawChildren}, childIndex) => {

      const id = currentIndex;

      const [children, newIndex] = enumerateEntries(rawChildren, currentIndex + 1);

      const newNode: ISolutionNode = {id, childIndex, text, applicability, subTexts, children};

      return [[...acc, newNode], newIndex];
    },
    [[], currentMinIndex]
  );

}
