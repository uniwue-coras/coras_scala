import {TreeNode} from './treeNode';
import {ApplicableText} from '../exercise/correctionValues';
import {ISolutionNode} from '../myTsModels';
import {Applicability} from '../model/applicability';

export interface RawSolutionEntry extends TreeNode<RawSolutionEntry> {
  text: string;
  applicability: Applicability;
  subTexts: ApplicableText[];
}

export function enumerateEntries(entries: RawSolutionEntry[], currentMinIndex = 0): [ISolutionNode[], number] {

  return entries.reduce<[ISolutionNode[], number]>(
    ([acc, currentIndex], {text, applicability, subTexts, children: rawChildren}) => {

      const id = currentIndex;

      const [children, newIndex] = enumerateEntries(rawChildren, currentIndex + 1);

      const newNode: ISolutionNode = {id, text, applicability, subTexts, children};

      return [[...acc, newNode], newIndex];
    },
    [[], currentMinIndex]
  );

}
