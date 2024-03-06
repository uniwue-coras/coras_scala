export const enum Correctness {
  Unspecified = 'Unspecified',
  Wrong = 'Wrong',
  Partially = 'Partially',
  Correct = 'Correct',
}

export function nextCorrectness(current: Correctness): Correctness {
  return {
    [Correctness.Unspecified]: Correctness.Wrong,
    [Correctness.Wrong]: Correctness.Partially,
    [Correctness.Partially]: Correctness.Correct,
    [Correctness.Correct]: Correctness.Unspecified
  }[current];
}
