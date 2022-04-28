import {Match, MatchingResult} from './matchingResult';

export type MatchFunc<T> = (sampleValue: T, userValue: T) => boolean;

interface FindMatchResult<T> {
  match: Match<T>;
  remainingUserSolutionEntries: T[];
}

function findSingleCertainMatch<T>(sampleSolutionEntry: T, userSolutionEntries: T[], checkFunc: MatchFunc<T>): FindMatchResult<T> | undefined {

  type ReduceObject = {
    match?: Match<T>;
    checkedUserSolutionEntries: T[];
  }

  const {match, checkedUserSolutionEntries} = userSolutionEntries.reduce<ReduceObject>(
    ({match, checkedUserSolutionEntries}, userSolutionEntry) => {
      if (match) {
        // A match was already found, ignore this sample value
        return {match, checkedUserSolutionEntries: [...checkedUserSolutionEntries, userSolutionEntry]};
      } else {
        return checkFunc(sampleSolutionEntry, userSolutionEntry)
          ? {match: {sampleSolutionEntry, userSolutionEntry}, checkedUserSolutionEntries}
          : {checkedUserSolutionEntries: [...checkedUserSolutionEntries, userSolutionEntry]};
      }
    }, {checkedUserSolutionEntries: []});

  return match
    ? {match, remainingUserSolutionEntries: checkedUserSolutionEntries}
    : undefined;
}

export function findCertainMatches<T>(sampleValues: T[], userValues: T[], checkFunc: MatchFunc<T>): MatchingResult<T> {
  return sampleValues.reduce<MatchingResult<T>>(
    ({matches, notMatchedUser, notMatchedSample}, currentSampleValue) => {

      const maybeMatch = findSingleCertainMatch(currentSampleValue, notMatchedUser, checkFunc);

      if (!maybeMatch) {
        return {matches, notMatchedUser, notMatchedSample: [...notMatchedSample, currentSampleValue]};
      }

      const {match, remainingUserSolutionEntries} = maybeMatch;

      return {matches: [...matches, match], notMatchedSample, notMatchedUser: remainingUserSolutionEntries};
    },
    {matches: [], notMatchedUser: userValues, notMatchedSample: []});
}
