import { RawSolutionNode } from './solutionEntryNode';
import { serverUrl } from '../urls';
import { IDocxText } from '../myTsModels';
import { store } from '../store';
import { dropWhile } from '../funcProg/array.extensions';
import { Applicability, Importance } from '../graphql';

export async function readFileOnline(file: File): Promise<IDocxText[]> {
  const body = new FormData();
  body.append('docxFile', file);

  const userToken = store.getState().user.user?.token;

  const headers = userToken !== undefined
    ? { 'Authentication': `Bearer ${userToken}` }
    : undefined;

  try {
    const response = await fetch(`${serverUrl}/readDocument`, { method: 'post', body, headers });

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function extractApplicability(text: string): [string, Applicability] {
  const regexExecArray = /\(([+-])\)/.exec(text);

  if (regexExecArray === null) {
    return [text, Applicability.NotSpecified];
  }

  const newText = text.substring(0, regexExecArray.index).trim() + ' ' + text.substring(regexExecArray.index + regexExecArray[0].length).trim();

  return [
    newText.trim(),
    regexExecArray[1] === '+' ? Applicability.Applicable : Applicability.NotApplicable
  ];
}

function extractProblemFocusIntensity(text: string): [string, Importance | undefined] {
  const regexExecArray = /\*{1,3}/.exec(text);

  if (regexExecArray === null) {
    return [text, undefined];
  }

  const newText = text.substring(0, regexExecArray.index).trim() + ' ' + text.substring(regexExecArray.index + regexExecArray[0].length).trim();

  let importance: Importance | undefined;

  switch (regexExecArray.length) {
    case 1:
      importance = Importance.Less;
      break;
    case 2:
      importance = Importance.Medium;
      break;
    case 3:
      importance = Importance.More;
      break;
    default:
      importance = undefined;
      break;
  }

  return [newText, importance];
}

function handleNextLine(lines: IDocxText[], currentLevel: number): [RawSolutionNode | undefined, IDocxText[]] {
  if (lines.length === 0) {
    return [undefined, []];
  }

  const [{ text: lineText, level }, ...otherLines] = lines;

  const [textAfterApplicabilityExtraction, applicability] = extractApplicability(lineText);
  const [text, focusIntensity] = extractProblemFocusIntensity(textAfterApplicabilityExtraction);

  if (level === undefined) {
    return [{ isSubText: true, text, applicability, focusIntensity, children: [] }, otherLines];
  }

  if (level <= currentLevel) {
    return [undefined, lines];
  }

  const [children, remainingLines] = handleLines(otherLines, level);

  return [{ isSubText: false, text, applicability, focusIntensity, children }, remainingLines];
}

function handleLines(lines: IDocxText[], currentLevel: number): [RawSolutionNode[], IDocxText[]] {
  if (lines.length === 0) {
    return [[], []];
  }

  const nodes: RawSolutionNode[] = [];

  let [maybeNextNode, remainingLines]: [RawSolutionNode | undefined, IDocxText[]] = [undefined, lines];

  do {
    [maybeNextNode, remainingLines] = handleNextLine(remainingLines, currentLevel);

    if (maybeNextNode !== undefined) {
      nodes.push(maybeNextNode);
    }
  } while (maybeNextNode !== undefined && remainingLines.length > 0);

  return [nodes, remainingLines];
}

export function convertTextsToNodes(lines: IDocxText[]): RawSolutionNode[] {
  // drop starting text that is not heading
  const cleanedLines = dropWhile(lines, (l) => l.level === undefined);

  return handleLines(cleanedLines, 0)[0];
}
