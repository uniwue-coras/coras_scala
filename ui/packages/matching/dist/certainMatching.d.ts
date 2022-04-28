import { MatchingResult } from './matchingResult';
export declare type MatchFunc<T> = (sampleValue: T, userValue: T) => boolean;
export declare function findCertainMatches<T>(sampleValues: T[], userValues: T[], checkFunc: MatchFunc<T>): MatchingResult<T>;
//# sourceMappingURL=certainMatching.d.ts.map