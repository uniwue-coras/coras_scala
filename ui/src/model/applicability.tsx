import {Applicability} from '../graphql';

export const applicabilityValues: Applicability[] = [
  Applicability.NotSpecified, Applicability.NotApplicable, Applicability.Applicable
];

export function stringifyApplicability(a: Applicability): string {
  switch (a) {
    case Applicability.NotSpecified:
      return '(k. a.)';
    case Applicability.NotApplicable:
      return '(-)';
    case Applicability.Applicable:
      return '(+)';
  }
}

export interface ApplicableText {
  text: string;
  applicability: Applicability;
}

const applicabilityRegex = /\(([+-])\)/;

export function extractApplicability(text: string): ApplicableText {
  const regexExecArray = applicabilityRegex.exec(text);

  if (!regexExecArray) {
    return {text, applicability: Applicability.NotSpecified};
  }

  const newText = text.substring(0, regexExecArray.index).trim() + ' ' + text.substring(regexExecArray.index + regexExecArray[0].length).trim();

  const applicability = regexExecArray[1] === '+' ? Applicability.Applicable : Applicability.NotApplicable;

  return {text: newText, applicability};
}
