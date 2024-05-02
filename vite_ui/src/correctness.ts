import { Correctness } from './graphql';

export function nextCorrectness(current: Correctness): Correctness {
  return {
    undefined: Correctness.Wrong,
    [Correctness.Unspecified]: Correctness.Correct,
    [Correctness.Correct]: Correctness.Partially,
    [Correctness.Partially]: Correctness.Wrong,
    [Correctness.Wrong]: Correctness.Unspecified,
  }[current];
}
