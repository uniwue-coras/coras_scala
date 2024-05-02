import { Correctness } from '../graphql';

function correctnessColor(correctness: Correctness): string {
  return {
    [Correctness.Correct]: 'green',
    [Correctness.Partially]: 'yellow',
    [Correctness.Wrong]: 'red',
    [Correctness.Unspecified]: 'slate'
  }[correctness];
}

export const correctnessTextColor = (correctness: Correctness) => `text-${correctnessColor(correctness)}-500`;

export const correctnessBorderColor = (correctness: Correctness) => `border-${correctnessColor(correctness)}-500`;
