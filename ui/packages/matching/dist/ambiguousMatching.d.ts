import { AmbiguousAssessment, AmbiguousMatchingResult } from './matchingResult';
export declare type AmbiguousMatchFunc<T, AR extends AmbiguousAssessment = AmbiguousAssessment> = (t1: T, t2: T) => AR | undefined;
export declare function findAmbiguousMatches<T, AR extends AmbiguousAssessment = AmbiguousAssessment>(sampleValues: T[], userValues: T[], generateMatch: AmbiguousMatchFunc<T, AR>, certaintyThreshold?: number): AmbiguousMatchingResult<T, AR>;
//# sourceMappingURL=ambiguousMatching.d.ts.map