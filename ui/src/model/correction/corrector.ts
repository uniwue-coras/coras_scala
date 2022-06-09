import {nounExtractionMatcher} from './nounExtractionMatcher';
import {ApplicabilityComparisonResult, compareApplicability} from './comparisonResult';
import {combinedMatching, Match, MatchFunc, MatchingResult} from '@coras/matching';
import {ISolutionNode} from '../../exercise/correctionValues';


export const stringContainsMatcher: MatchFunc<ISolutionNode> = ({text: sampleText}, {text: userText}) => sampleText.indexOf(userText) >= 0;

export interface SolutionEntryComment {
  startIndex: number;
  endIndex: number;
  comment: string;
}

// Tree Matching...

export interface TreeMatch extends Match<ISolutionNode> {
  childMatches: TreeMatchingResult;
  applicabilityComparison: ApplicabilityComparisonResult;
  comments: SolutionEntryComment[];
}

export function compareTreeMatches(e1: TreeMatch, e2: TreeMatch): number {
  return e1.sampleSolutionEntry.childIndex - e2.sampleSolutionEntry.childIndex;
}

export type TreeMatchingResult = MatchingResult<ISolutionNode, TreeMatch>;

export function analyzeNodeMatch(sampleSolutionEntry: ISolutionNode, userSolutionEntry: ISolutionNode): TreeMatch {
  return {
    userSolutionEntry,
    sampleSolutionEntry,
    applicabilityComparison: compareApplicability(sampleSolutionEntry.applicability, userSolutionEntry.applicability),
    childMatches: newCorrectTree(sampleSolutionEntry.children, userSolutionEntry.children),
    comments: [],
  };
}

export function newCorrectTree(sampleSolution: ISolutionNode[], userSolution: ISolutionNode[]): TreeMatchingResult {
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
