import {TreeNode} from './treeNode';
import {Applicability} from '../graphql';

export interface AnalyzedText {
  text: string;
  applicability: Applicability;
}

export interface SolutionEntryNode<T extends SolutionEntryNode<T>> extends TreeNode<T>, AnalyzedText {
  subTexts: AnalyzedText[];
}

// Raw entries

export type RawSolutionEntry = SolutionEntryNode<RawSolutionEntry>;

// Correction entry

export interface NumberedAnalyzedSolutionEntry extends SolutionEntryNode<NumberedAnalyzedSolutionEntry> {
  id: number;
  index: number;
}
