import {RawSolutionNode} from '../solutionInput/solutionEntryNode';
import {extractApplicability} from './applicability';
import {serverUrl} from '../urls';
import {IDocxText} from '../myTsModels';
import {store} from '../store';
import {dropWhile} from '../funcProg';


export async function readFileOnline(file: File): Promise<IDocxText[]> {
  const body = new FormData();
  body.append('docxFile', file);

  const headers = {'Authentication': `Bearer ${store.getState().user?.user?.token || ''}`};

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

  const [nodes, remainingLines] = handleLines(cleanedLines, 0);

  return nodes;

  //return handleParsedLines(cleanedLines);
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

  const [{text: lineText, level}, ...otherLines] = lines;

  const {text, applicability} = extractApplicability(lineText);

  if (level === undefined) {
    return [{isSubText: true, text, applicability, children: []}, otherLines];
  }

  if (level <= currentLevel) {
    return [undefined, lines];
  }

  const [children, remainingLines] = handleLines(otherLines, level);


  return [{isSubText: false, text, applicability, children}, remainingLines];
}

/*
function handleParsedLines(parsedLines: IDocxText[]): RawSolutionNode[] {
  return splitParsedLines(parsedLines).map((line) => splitLinesToSolutionEntry(line));
}

function splitParsedLines(parsedLines: IDocxText[]): IDocxText[][] {
  const levels = parsedLines
    .map((l) => l.level)
    .filter((x): x is number => x !== undefined);

  const minimalLevel = Math.min(...levels);

  const result: IDocxText[][] = [];

  parsedLines.forEach((parsedLine) => {
    if (parsedLine.level !== undefined && parsedLine.level === minimalLevel) {
      // New top level node found
      result.push([]);
    }

    result[result.length - 1].push(parsedLine);
  });

  return result;
}

function splitLinesToSolutionEntry(lines: IDocxText[]): RawSolutionNode {
  const [{text: initialText, level}, ...other] = lines;

  const isSubText = level === undefined;

  const {text, applicability} = extractApplicability(initialText);

  const children = other.length > 0 ? handleParsedLines(other) : [];

  return {isSubText, text, applicability, children};
}
 */
