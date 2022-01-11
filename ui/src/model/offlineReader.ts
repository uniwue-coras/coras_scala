import {convertToHtml} from 'mammoth';
import {RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {dissectEntryText, extractApplicability} from './analysis/entryTextDissector';
import {AnalyzedSubTextInput} from '../graphql';

export function analyzeSubText(subText: string): AnalyzedSubTextInput {
  const [text, applicability] = extractApplicability(subText);

  return {text, applicability};
}

export async function readFile(file: File): Promise<Document> {
  const arrayBuffer = await file.arrayBuffer();
  const {value} = await convertToHtml({arrayBuffer});

  return new DOMParser().parseFromString(value, 'text/html');
}

export function readDocument(document: Document): RawSolutionEntry[] {
  return readHeadingChildren(document);
}


interface ParsedHeading {
  level: number;
  text: string;
}

interface ParsedParagraph {
  text: string;
}

type ParsedLine = ParsedHeading | ParsedParagraph;


interface ParsedEntry extends ParsedHeading {
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


function compressParsedLines(parsedLines: ParsedLine[]): ParsedEntry[] {
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


function readHeadingChildren(document: Document): RawSolutionEntry[] {
  const parsedLines: ParsedLine[] = Array.from(document.body.children)
    .map<ParsedLine | undefined>((el) => {
      if (el instanceof HTMLHeadingElement) {
        return {level: parseInt(el.tagName.charAt(1)), text: el.textContent || ''};
      } else if (el instanceof HTMLParagraphElement) {
        return {text: el.textContent || ''};
      }
    })
    .filter((p): p is ParsedLine => !!p);

  return handleParsedLines(compressParsedLines(parsedLines));
}
