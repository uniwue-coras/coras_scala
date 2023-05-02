import {RawSolutionNode} from '../solutionInput/solutionEntryNode';
import {extractApplicability} from './applicability';
import {serverUrl} from '../urls';
import {IDocxText} from '../myTsModels';
import {store} from '../store';
import {dropWhile} from '../funcProg';

export async function readFileOnline(file: File): Promise<IDocxText[]> {
  const body = new FormData();
  body.append('docxFile', file);

  const userToken = store.getState().user.user?.token;

  const headers = userToken !== undefined
    ? {'Authentication': `Bearer ${userToken}`}
    : undefined;

  return await fetch(`${serverUrl}/readDocument`, {method: 'post', body, headers})
    .then<IDocxText[]>((res) => res.json())
    .catch((error) => {
      console.error(error);
      return [];
    });
}

export function readDocument(lines: IDocxText[]): RawSolutionNode[] {
  // drop starting text that is not heading
  const cleanedLines = dropWhile(lines, (l) => l.level === undefined);

  return handleLines(cleanedLines, 0)[0];
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

function handleNextLine(lines: IDocxText[], currentLevel: number): [RawSolutionNode | undefined, IDocxText[]] {
  if (lines.length === 0) {
    return [undefined, []];
  }

  const [{text: lineText, level, extractedParagraphs}, ...otherLines] = lines;

  const {text, applicability} = extractApplicability(lineText);

  if (level === undefined) {
    return [{isSubText: true, text, applicability, children: [], extractedParagraphs}, otherLines];
  }

  if (level <= currentLevel) {
    return [undefined, lines];
  }

  const [children, remainingLines] = handleLines(otherLines, level);

  return [{isSubText: false, text, applicability, children, extractedParagraphs}, remainingLines];
}
