import { Correctness } from './graphql';

interface IMatch<T, E> {
  sampleValue: T;
  userValue: T;
  maybeExplanation?: E;
}

export interface IMatchingResult<T, E> {
  matches: IMatch<T, E>[];
  notMatchedSample: T[];
  notMatchedUser: T[];
  certainty: number;
}

export function checkMatchingResultCorrectness<T, E>({ notMatchedSample }: IMatchingResult<T, E>): Correctness {
  return notMatchedSample.length > 0 ? Correctness.Wrong : Correctness.Correct;
}
