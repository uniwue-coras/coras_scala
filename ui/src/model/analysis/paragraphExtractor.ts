import {romanToInt} from '../romanNumerals';
import {ParagraphCitationInput, ParagraphType} from '../../graphql';

export const paragraphCitationRegex = /(?<type>§|Art.)\s*(?<paragraph>\d+)\s*((?<romanSubParagraph>[IVXLC]+\s)|(Abs.|Absatz)?\s*(?<arabianSubParagraph>\d+))?\s*(S\.|Satz|Nr.)?\s*(?<sentence>\d+)?\s*(?<lawcode>[A-Za-z]+)?/g;

export function stringifyParagraphCitation({paragraphType, paragraph, subParagraph, sentence, lawCode}: ParagraphCitationInput): string {
  return `${paragraphType === ParagraphType.German ? '§' : 'Art.'} ${paragraph}${subParagraph ? ` Abs. ${subParagraph}` : ''}${sentence ? ` Satz ${sentence}` : ''} ${lawCode || ''}`;
}

function readParagraphNumber(groups: { [groupName: string]: string }): number | undefined {
  if (groups.romanSubParagraph) {
    return romanToInt(groups.romanSubParagraph.trim());
  } else if (groups.arabianSubParagraph) {
    return parseInt(groups.arabianSubParagraph);
  } else {
    return undefined;
  }
}

export function analyzeParagraphs(text: string): ParagraphCitationInput[] {
  return Array.from(text.matchAll(paragraphCitationRegex))
    .map((m) => {
      if (!m.index && m.index !== 0) {
        throw new Error('Start index not set!');
      }
      if (!m.groups) {
        throw new Error('No groups in regex!');
      }

      return {
        startIndex: m.index,
        endIndex: m.index + m[0].length,
        paragraphType: m.groups.type === '§' ? ParagraphType.German : ParagraphType.Bavarian,
        paragraph: parseInt(m.groups.paragraph),
        subParagraph: readParagraphNumber(m.groups),
        sentence: m.groups.sentence ? parseInt(m.groups.sentence) : undefined,
        lawCode: m.groups.lawcode
      };
    });
}
