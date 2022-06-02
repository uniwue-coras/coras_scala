import {Applicability} from '../graphql';
import {AnalyzedText} from '../solutionInput/solutionEntryNode';

const applicabilityRegex = /\(([+-])\)/;

export function extractApplicability(text: string): AnalyzedText {
  const regexExecArray = applicabilityRegex.exec(text);

  if (regexExecArray) {
    const newText = text.substring(0, regexExecArray.index).trim() + ' ' + text.substring(regexExecArray.index + regexExecArray[0].length).trim();

    const applicability = regexExecArray[1] === '+' ? Applicability.Applicable : Applicability.NotApplicable;

    return {text: newText, applicability};
  } else {
    return {text, applicability: Applicability.NotSpecified};
  }
}
