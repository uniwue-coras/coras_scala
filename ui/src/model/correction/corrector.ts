import {NumberedAnalyzedSolutionEntry} from '../../solutionInput/solutionEntryNode';
import {nounExtractionMatcher} from './nounExtractionMatcher';
import {Match, MatchingResult} from '../matching/matchingResult';
import {compareParagraphCitations, ParagraphMatchingResult} from './paragraphMatcher';
import {ApplicabilityComparisonResult, compareApplicability} from './comparisonResult';
import {combinedMatching} from '../matching/combinedMatching';
import {MatchFunc} from '../matching/certainMatching';


export const stringContainsMatcher: MatchFunc<NumberedAnalyzedSolutionEntry> = ({text: sampleText}, {text: userText}) => sampleText.indexOf(userText) >= 0;

// Tree Matching...

export interface MatchAnalysis {
  paragraphMatch?: ParagraphMatchingResult;
  applicabilityComparison: ApplicabilityComparisonResult;
}

export interface TreeMatch extends Match<NumberedAnalyzedSolutionEntry> {
  childMatches: TreeMatchingResult;
  analysis: MatchAnalysis;
}

export function compareTreeMatches(e1: TreeMatch, e2: TreeMatch): number {
  return e1.sampleSolutionEntry.index - e2.sampleSolutionEntry.index;
}

export type TreeMatchingResult = MatchingResult<NumberedAnalyzedSolutionEntry, TreeMatch>;

export function analyzeNodeMatch(sampleSolutionEntry: NumberedAnalyzedSolutionEntry, userSolutionEntry: NumberedAnalyzedSolutionEntry): TreeMatch {
  const childMatches = newCorrectTree(sampleSolutionEntry.children, userSolutionEntry.children);

  const analysis: MatchAnalysis = {
    applicabilityComparison: compareApplicability(sampleSolutionEntry.applicability, userSolutionEntry.applicability),
    paragraphMatch: compareParagraphCitations(sampleSolutionEntry.paragraphCitations, userSolutionEntry.paragraphCitations)
  };

  return {userSolutionEntry, sampleSolutionEntry, analysis, childMatches};
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
