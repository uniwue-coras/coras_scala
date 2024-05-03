import { Correctness } from '../graphql';

export function correctnessTextColor(correctness: Correctness) {
  return { // Don't refactor, css pruning will not pick up classes!
    [Correctness.Correct]: 'text-green-600',
    [Correctness.Partially]: 'text-yellow-600',
    [Correctness.Wrong]: 'text-red-600',
    [Correctness.Unspecified]: 'text-slate-600'
  }[correctness];
}

export function correctnessBorderColor(correctness: Correctness) {
  return { // Don't refactor, css pruning will not pick up classes!
    [Correctness.Correct]: 'border-green-600',
    [Correctness.Partially]: 'border-yellow-600',
    [Correctness.Wrong]: 'border-red-600',
    [Correctness.Unspecified]: 'border-slate-600'
  }[correctness];
}
