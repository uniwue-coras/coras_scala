import {TreeNode} from './treeNode';
import {AnalyzedSubTextInput, Applicability, Maybe} from '../graphql';

export interface AnalyzedText {
  text: string;
  applicability: Applicability;
}

export interface SolutionEntryNode<T extends SolutionEntryNode<T>> extends TreeNode<T>, AnalyzedText {
  priorityPoints?: Maybe<number>;
  weight?: Maybe<number>;
  otherNumber?: Maybe<number>;
  subTexts: AnalyzedSubTextInput[];
}

// Raw entries

export type RawSolutionEntry = SolutionEntryNode<RawSolutionEntry>;

// Analyzed entries

/**
 * @deprecated
 */
export type AnalyzedSolutionEntry = SolutionEntryNode<AnalyzedSolutionEntry>;

// Correction entry

export interface NumberedAnalyzedSolutionEntry extends SolutionEntryNode<NumberedAnalyzedSolutionEntry> {
  id: number;
  index: number;
}


export function analyzeRawSolutionEntry({text, children: rawChildren, ...rest}: RawSolutionEntry): AnalyzedSolutionEntry {
  return {
    ...rest,
    text,
    children: rawChildren.map(analyzeRawSolutionEntry)
  };
}
