import {TreeNode} from './treeNode';
import {analyzeParagraphs} from '../model/analysis/paragraphExtractor';
import {AnalyzedSubTextInput, Applicability, Maybe, ParagraphCitationFragment, ParagraphCitationInput} from '../graphql';

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

export interface AnalyzedSolutionEntry extends SolutionEntryNode<AnalyzedSolutionEntry> {
  paragraphCitations: ParagraphCitationInput[];
}

// Correction entry

export interface NumberedAnalyzedSolutionEntry extends SolutionEntryNode<NumberedAnalyzedSolutionEntry> {
  id: number;
  index: number;
  paragraphCitations: ParagraphCitationFragment[];
}


export function analyzeRawSolutionEntry({text, children: rawChildren, ...rest}: RawSolutionEntry): AnalyzedSolutionEntry {
  return {
    ...rest,
    text,
    paragraphCitations: analyzeParagraphs(text),
    children: rawChildren.map(analyzeRawSolutionEntry)
  };
}
