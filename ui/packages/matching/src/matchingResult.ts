// Certain matches

export interface Match<T> {
  userValue: T;
  sampleValue: T;
}

export interface MatchingResult<T, M extends Match<T> = Match<T>> {
  matches: M[];
  notMatchedUser: T[];
  notMatchedSample: T[];
}

export function certainMatchingResultQuality<T>({matches, notMatchedUser, notMatchedSample}: MatchingResult<T>): number {
  return matches.length / (matches.length + notMatchedUser.length + notMatchedSample.length);
}

// Ambiguous matches

export interface AmbiguousAssessment {
  certainty: number;
}

export interface AmbiguousMatch<T, R extends AmbiguousAssessment = AmbiguousAssessment> extends Match<T> {
  matchAnalysis: R;
}

export interface AmbiguousMatchingResult<T, R extends AmbiguousAssessment = AmbiguousAssessment> extends MatchingResult<T> {
  matches: AmbiguousMatch<T, R>[];
}

export function ambiguousMatchingResultQuality<T, R extends AmbiguousAssessment = AmbiguousAssessment>({matches}: AmbiguousMatchingResult<T, R>): number {
  // FIXME: baloney...
  return matches.reduce<number>((a, b) => a + b.matchAnalysis.certainty, 0);
}


