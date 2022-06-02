import {NumberedAnalyzedSolutionEntry} from '../../solutionInput/solutionEntryNode';
import {nounExtractionMatcher} from './nounExtractionMatcher';
import {ApplicabilityComparisonResult, compareApplicability} from './comparisonResult';
import {combinedMatching, Match, MatchFunc, MatchingResult} from '@coras/matching';


export const stringContainsMatcher: MatchFunc<NumberedAnalyzedSolutionEntry> = ({text: sampleText}, {text: userText}) => sampleText.indexOf(userText) >= 0;

export interface SolutionEntryComment {
  startIndex: number;
  endIndex: number;
  comment: string;
}

// Tree Matching...

export interface TreeMatch extends Match<NumberedAnalyzedSolutionEntry> {
  childMatches: TreeMatchingResult;
  applicabilityComparison: ApplicabilityComparisonResult;
  comments: SolutionEntryComment[];
}

export function compareTreeMatches(e1: TreeMatch, e2: TreeMatch): number {
  return e1.sampleSolutionEntry.index - e2.sampleSolutionEntry.index;
}

export type TreeMatchingResult = MatchingResult<NumberedAnalyzedSolutionEntry, TreeMatch>;

export function analyzeNodeMatch(sampleSolutionEntry: NumberedAnalyzedSolutionEntry, userSolutionEntry: NumberedAnalyzedSolutionEntry): TreeMatch {
  return {
    userSolutionEntry,
    sampleSolutionEntry,
    applicabilityComparison: compareApplicability(sampleSolutionEntry.applicability, userSolutionEntry.applicability),
    childMatches: newCorrectTree(sampleSolutionEntry.children, userSolutionEntry.children),
    comments: [],
  };
}

export function newCorrectTree(sampleSolution: NumberedAnalyzedSolutionEntry[], userSolution: NumberedAnalyzedSolutionEntry[]): TreeMatchingResult {
  const {
    certainMatches,
    ambiguousMatches,
    notMatchedSample,
    notMatchedUser
  } = combinedMatching(sampleSolution, userSolution, stringContainsMatcher, nounExtractionMatcher);

  const matches = [...certainMatches, ...ambiguousMatches]
    .map(({userSolutionEntry, sampleSolutionEntry, ...rest}) => ({...analyzeNodeMatch(sampleSolutionEntry, userSolutionEntry), ...rest}));

  return {matches, notMatchedUser, notMatchedSample};

}
