import {TreeNode} from './treeNode';
import {ApplicableText} from '../exercise/correctionValues';

export interface RawSolutionEntry extends TreeNode<RawSolutionEntry>, ApplicableText {
  subTexts: ApplicableText[];
}
