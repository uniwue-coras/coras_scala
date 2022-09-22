import {nounExtractionMatcher} from './nounExtractionMatcher';
import {combinedMatching, MatchFunc} from '@coras/matching';
import {ISolutionNode, ISolutionNodeMatch, ISolutionNodeMatchingResult} from '../../myTsModels';

type MatchedNodeType = ISolutionNode;

const stringContainsMatcher: MatchFunc<{ text: string }> = ({text: sampleText}, {text: userText}) => sampleText.indexOf(userText) >= 0;

export function compareTreeMatches(e1: ISolutionNodeMatch, e2: ISolutionNodeMatch): number {
  return e1.sampleValue.childIndex - e2.sampleValue.childIndex;
}

export function analyzeNodeMatch(sampleValue: MatchedNodeType, userValue: MatchedNodeType): ISolutionNodeMatch {
  return {
    userValue,
    sampleValue,
    childMatches: newCorrectTree(sampleValue.children, userValue.children),
    comments: [],
  };
}

function newCorrectTree(sampleSolution: MatchedNodeType[], userSolution: MatchedNodeType[]): ISolutionNodeMatchingResult {
  const {
    certainMatches,
    ambiguousMatches,
    notMatchedSample,
    notMatchedUser
  } = combinedMatching(sampleSolution, userSolution, stringContainsMatcher, nounExtractionMatcher);

  const matches = [...certainMatches, ...ambiguousMatches]
    .map(({userValue, sampleValue, ...rest}) => ({...analyzeNodeMatch(sampleValue, userValue), ...rest}));

  return {matches, notMatchedUser, notMatchedSample};

}
