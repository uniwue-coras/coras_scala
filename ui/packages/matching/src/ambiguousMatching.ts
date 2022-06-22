import {AmbiguousAssessment, AmbiguousMatch, AmbiguousMatchingResult, ambiguousMatchingResultQuality} from './matchingResult';

interface MatchGenerationResult<T, R extends AmbiguousAssessment = AmbiguousAssessment> {
  match: AmbiguousMatch<T, R>;
  newNotMatchedUser: T[];
}

function generateAllPossibleMatches<T, R extends AmbiguousAssessment = AmbiguousAssessment>(
  sampleSolutionEntry: T,
  userSolutionEntries: T[],
  generateMatch: AmbiguousMatchFunc<T, R>,
  certaintyThreshold = 0
): MatchGenerationResult<T, R>[] {

  const result: MatchGenerationResult<T, R>[] = [];

  const prior: T[] = [];
  const later: T[] = [...userSolutionEntries];

  while (later.length > 0) {
    // FIXME: do not use shift or else you always have to copy the array!
    const userSolutionEntry = later.shift()!;

    const matchAnalysis = generateMatch(sampleSolutionEntry, userSolutionEntry);

    if (matchAnalysis && matchAnalysis.certainty > certaintyThreshold) {
      result.push({
        match: {sampleValue: sampleSolutionEntry, userValue: userSolutionEntry, matchAnalysis},
        newNotMatchedUser: [...prior, ...later]
      });
    }

    prior.push(userSolutionEntry);
  }

  return result;
}

export type AmbiguousMatchFunc<T, AR extends AmbiguousAssessment = AmbiguousAssessment> = (t1: T, t2: T) => AR | undefined;

export function findAmbiguousMatches<T, AR extends AmbiguousAssessment = AmbiguousAssessment>(
  sampleValues: T[],
  userValues: T[],
  generateMatch: AmbiguousMatchFunc<T, AR>,
  certaintyThreshold = 0
): AmbiguousMatchingResult<T, AR> {

  function reductionFunc(allMatchingResults: AmbiguousMatchingResult<T, AR>[], sampleSolutionEntry: T): AmbiguousMatchingResult<T, AR>[] {
    return allMatchingResults.flatMap(({matches, notMatchedUser, notMatchedSample}) => {

      const allPossibleMatches: MatchGenerationResult<T, AR>[] = generateAllPossibleMatches(sampleSolutionEntry, notMatchedUser, generateMatch, certaintyThreshold)
        .filter(({match}) => match.matchAnalysis.certainty > certaintyThreshold);

      return allPossibleMatches.length === 0
        ? {matches, notMatchedUser, notMatchedSample: [...notMatchedSample, sampleSolutionEntry]}
        : allPossibleMatches.map(({match, newNotMatchedUser}) => ({
          matches: [...matches, match],
          notMatchedSample,
          notMatchedUser: newNotMatchedUser
        }));
    });
  }

  return sampleValues
    .reduce(reductionFunc, [{matches: [], notMatchedUser: userValues, notMatchedSample: []}])
    .sort((a, b) => ambiguousMatchingResultQuality(a) - ambiguousMatchingResultQuality(b))[0];
}
