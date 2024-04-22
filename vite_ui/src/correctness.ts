import { Correctness } from './graphql';

export function nextCorrectness(current: Correctness): Correctness {
  return {
    undefined: Correctness.Wrong,
    [Correctness.Unspecified]: Correctness.Wrong,
    [Correctness.Wrong]: Correctness.Partially,
    [Correctness.Partially]: Correctness.Correct,
    [Correctness.Correct]: Correctness.Unspecified
  }[current];
}
