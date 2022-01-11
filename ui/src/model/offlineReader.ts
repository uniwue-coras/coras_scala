import {RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {dissectEntryText, extractApplicability} from './analysis/entryTextDissector';
import {AnalyzedSubTextInput} from '../graphql';
import {serverUrl} from "../urls";
import {DocxText, IHeading} from "../myTsModels";

export async function readFileOnline(file: File): Promise<DocxText[]> {
  const body = new FormData();
  body.append('docxFile', file);

  return fetch(`${serverUrl}/readDocument`, {method: 'POST', body})
    .then<DocxText[]>((res) => res.json());
}

export function analyzeSubText(subText: string): AnalyzedSubTextInput {
  const [text, applicability] = extractApplicability(subText);

  return {text, applicability};
}

export function readDocument(lines: DocxText[]): RawSolutionEntry[] {
  return handleParsedLines(compressParsedLines(lines))
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

  const {newText: text, applicability, priorityPoints, weight, otherNumber} = dissectEntryText(initialText);

  const subTexts = initialSubTexts.map((s) => analyzeSubText(s));

  return {text, applicability, priorityPoints, weight, otherNumber, children, subTexts};
}
