/*
export enum Applicability {
  NotSpecified = 'NotSpecified',
  NotApplicable = 'NotApplicable',
  Applicable = 'Applicable'
}
 */

import {Applicability} from '../myTsModels';

export const applicabilityValues: Applicability[] = [
  /* Applicability.NotSpecified, Applicability.NotApplicable, Applicability.Applicable*/
  'NotSpecified', 'NotApplicable', 'Applicable'
];

export function stringifyApplicability(a: Applicability): string {
  switch (a) {
    /*
    case Applicability.NotSpecified:
      return '(k. a.)';
    case Applicability.NotApplicable:
      return '(-)';
    case Applicability.Applicable:
      return '(+)';
     */
    case 'NotSpecified':
      return '(k. a.)';
    case 'NotApplicable':
      return '(-)';
    case 'Applicable':
      return '(+)';
  }
}

export interface ApplicableText {
  text: string;
  applicability: Applicability;
}
