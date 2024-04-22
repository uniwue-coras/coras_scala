import { Correctness } from "./graphql";

export function nextCorrectness(current: Correctness | undefined): Correctness {
  if (current === undefined) {
    return Correctness.Wrong;
  }

  return {
    undefined: Correctness.Wrong,
    [Correctness.Unspecified]: Correctness.Wrong,
    [Correctness.Wrong]: Correctness.Partially,
    [Correctness.Partially]: Correctness.Correct,
    [Correctness.Correct]: Correctness.Unspecified
  }[current];
}

export function minimalCorrectness(values: Correctness[]): Correctness {
  if (values.includes(Correctness.Wrong)) {
    return Correctness.Wrong;
  } else if (values.includes(Correctness.Partially)) {
    return Correctness.Partially;
  } else if (values.includes(Correctness.Correct)) {
    return Correctness.Correct;
  } else {
    return Correctness.Unspecified;
  }
}
