export interface Match<T> {
    userSolutionEntry: T;
    sampleSolutionEntry: T;
}
export interface MatchingResult<T, M extends Match<T> = Match<T>> {
    matches: M[];
    notMatchedUser: T[];
    notMatchedSample: T[];
}
export declare function certainMatchingResultQuality<T>({ matches, notMatchedUser, notMatchedSample }: MatchingResult<T>): number;
export interface AmbiguousAssessment {
    certainty: number;
}
export interface AmbiguousMatch<T, R extends AmbiguousAssessment = AmbiguousAssessment> extends Match<T> {
    matchAnalysis: R;
}
export interface AmbiguousMatchingResult<T, R extends AmbiguousAssessment = AmbiguousAssessment> extends MatchingResult<T> {
    matches: AmbiguousMatch<T, R>[];
}
export declare function ambiguousMatchingResultQuality<T, R extends AmbiguousAssessment = AmbiguousAssessment>({ matches }: AmbiguousMatchingResult<T, R>): number;
//# sourceMappingURL=matchingResult.d.ts.map