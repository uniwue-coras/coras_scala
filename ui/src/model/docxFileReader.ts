import {RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {extractApplicability} from './entryTextDissector';
import {serverUrl} from '../urls';
import {DocxText, IHeading} from '../myTsModels';
import {myAxios} from '../index';

export async function readFileOnline(file: File): Promise<DocxText[]> {
  const body = new FormData();
  body.append('docxFile', file);

  return await myAxios.post<DocxText[]>(`${serverUrl}/readDocument`, body, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(({data}) => data);
}

export function readDocument(lines: DocxText[]): RawSolutionEntry[] {
  return handleParsedLines(compressParsedLines(lines));
}

interface ParsedEntry extends IHeading {
  subTexts: string[];
}


function splitParsedLines(parsedLines: ParsedEntry[]): ParsedEntry[][] {
  const levels = parsedLines
    .map((l) => 'level' in l ? l.level : undefined)
    .filter((x): x is number => !!x);

  const minimalLevel = Math.min(...levels);

  const result: ParsedEntry[][] = [];

  parsedLines.forEach((parsedLine) => {
    if ('level' in parsedLine && parsedLine.level === minimalLevel) {
      result.push([]);
    }
    result[result.length - 1].push(parsedLine);
  });

  return result;
}

function compressParsedLines(parsedLines: DocxText[]): ParsedEntry[] {
  const entries: ParsedEntry[] = [];

  parsedLines.forEach((parsedLine) => {
    if ('level' in parsedLine) {
      entries.push({...parsedLine, subTexts: []});
    } else if (entries.length >= 1) {
      entries[entries.length - 1].subTexts.push(parsedLine.text);
    }
  });

  return entries;
}


function handleParsedLines(parsedLines: ParsedEntry[]): RawSolutionEntry[] {
  return splitParsedLines(parsedLines).map((line) => splitLinesToSolutionEntry(line));
}

function splitLinesToSolutionEntry(lines: ParsedEntry[]): RawSolutionEntry {
  const [{text: initialText, subTexts: initialSubTexts}, ...other] = lines;

  const children = other.length > 0 ? handleParsedLines(other) : [];

  const {text, applicability} = extractApplicability(initialText);

  return {text, applicability, children, subTexts: initialSubTexts.map(extractApplicability)};
}