import {AmbiguousAssessment, AmbiguousMatch, Match} from './matchingResult';
import {findCertainMatches, MatchFunc} from './certainMatching';
import {AmbiguousMatchFunc, findAmbiguousMatches} from './ambiguousMatching';

export interface CombinedMatchingResult<T, AR extends AmbiguousAssessment = AmbiguousAssessment> {
  certainMatches: Match<T>[];
  ambiguousMatches: AmbiguousMatch<T, AR>[];
  notMatchedUser: T[];
  notMatchedSample: T[];
}

export function combinedMatching<T, AR extends AmbiguousAssessment = AmbiguousAssessment>(
  sampleValues: T[],
  userValues: T[],
  certainMatchFunc: MatchFunc<T>,
  assessAmbiguousMatchCertainty: AmbiguousMatchFunc<T, AR>,
  certaintyThreshold = 0
): CombinedMatchingResult<T, AR> {

  const {
    matches: certainMatches,
    notMatchedUser: remainingUserValues,
    notMatchedSample: remainingSampleValues
  } = findCertainMatches(sampleValues, userValues, certainMatchFunc);

  const {
    matches: ambiguousMatches,
    notMatchedUser,
    notMatchedSample
  } = findAmbiguousMatches(remainingSampleValues, remainingUserValues, assessAmbiguousMatchCertainty, certaintyThreshold);

  return {certainMatches, ambiguousMatches, notMatchedUser, notMatchedSample};
}

export function combinedMatchingResultQuality<T, AR extends AmbiguousAssessment = AmbiguousAssessment>({
  certainMatches,
  ambiguousMatches,
  notMatchedSample,
  notMatchedUser
}: CombinedMatchingResult<T, AR>): number {
  return certainMatches.length + ambiguousMatches.map(({matchAnalysis: {certainty}}) => certainty).reduce((acc, val) => acc + val, 0) / (certainMatches.length + ambiguousMatches.length + notMatchedSample.length + notMatchedUser.length);
}
