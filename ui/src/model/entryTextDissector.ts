import {ApplicableText} from './applicability';
import {Applicability} from '../graphql';

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
