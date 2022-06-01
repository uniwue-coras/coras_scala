import {Applicability} from '../graphql';

const applicabilityRegex = /\(([+-])\)/;

const weightRegex = /\[(\d+)]/;
const priorityPoint = /(\*+)/;
const otherNumberRegex = /\((\d+)\)/;

function extract<T>(regex: RegExp, text: string, f: (r: RegExpExecArray) => T, defaultValue: T): [string, T] {
  const regexExecArray = regex.exec(text);

  if (regexExecArray) {
    const newText = text.substring(0, regexExecArray.index).trim() + ' ' + text.substring(regexExecArray.index + regexExecArray[0].length).trim();

    return [newText, f(regexExecArray)];
  } else {
    return [text, defaultValue];
  }
}

function readApplicability(regExpExecArray: RegExpExecArray): Applicability {
  return regExpExecArray[1] === '+' ? Applicability.Applicable : Applicability.NotApplicable;
}

export function extractApplicability(text: string): [string, Applicability] {
  return extract(applicabilityRegex, text, readApplicability, Applicability.NotSpecified);
}

interface TextDissectionResult {
  newText: string;
  applicability: Applicability;
  weight: number | undefined;
  priorityPoints: number | undefined;
  otherNumber: number | undefined;
}

export function dissectEntryText(text: string): TextDissectionResult {
  const [textWithoutApplicability, applicability] = extractApplicability(text);

  const [text3, weight] = extract(weightRegex, textWithoutApplicability, (regExpExecArray) => parseInt(regExpExecArray[1]), undefined);

  const [text4, priorityPoints] = extract(priorityPoint, text3, (regExpExecArray) => regExpExecArray[1].length, undefined);

  const [text5, otherNumber] = extract(otherNumberRegex, text4, (regExpExecArray) => parseInt(regExpExecArray[1]), undefined);

  return {newText: text5.trim(), applicability, weight, priorityPoints, otherNumber};
}
