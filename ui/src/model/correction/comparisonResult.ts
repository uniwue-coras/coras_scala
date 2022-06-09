import {Applicability} from '../../graphql';

export interface ComparisonResult<T> {
  userValue: T;
  sampleValue: T;
  correct: boolean;
  explanation: string;
}

export type ApplicabilityComparisonResult = ComparisonResult<Applicability>;

export function compareApplicability(sampleValue: Applicability, userValue: Applicability): ApplicabilityComparisonResult {

  const correct = userValue === sampleValue;

  const explanation = correct
    ? 'Korrekt'
    : 'Falsch';

  return {userValue, sampleValue, correct, explanation};
}
