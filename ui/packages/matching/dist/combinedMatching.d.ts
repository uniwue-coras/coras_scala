import { AmbiguousAssessment, AmbiguousMatch, Match } from './matchingResult';
import { MatchFunc } from './certainMatching';
import { AmbiguousMatchFunc } from './ambiguousMatching';
export interface CombinedMatchingResult<T, AR extends AmbiguousAssessment = AmbiguousAssessment> {
    certainMatches: Match<T>[];
    ambiguousMatches: AmbiguousMatch<T, AR>[];
    notMatchedUser: T[];
    notMatchedSample: T[];
}
export declare function combinedMatching<T, AR extends AmbiguousAssessment = AmbiguousAssessment>(sampleValues: T[], userValues: T[], certainMatchFunc: MatchFunc<T>, assessAmbiguousMatchCertainty: AmbiguousMatchFunc<T, AR>, certaintyThreshold?: number): CombinedMatchingResult<T, AR>;
export declare function combinedMatchingResultQuality<T, AR extends AmbiguousAssessment = AmbiguousAssessment>({ certainMatches, ambiguousMatches, notMatchedSample, notMatchedUser }: CombinedMatchingResult<T, AR>): number;
//# sourceMappingURL=combinedMatching.d.ts.map