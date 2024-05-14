import { ParagraphCitationFragment, ParagraphIdentifierFragment } from './graphql';

export function paragraphIdentifiersEqual(p1: ParagraphIdentifierFragment, p2: ParagraphIdentifierFragment): boolean {
  return p1.paragraphType === p2.paragraphType && p1.paragraph === p2.paragraph && p1.section === p2.section && p1.lawCode === p2.lawCode;
}

export function stringifyParagraphIdentifier({ paragraphType, paragraph, section, lawCode }: ParagraphIdentifierFragment): string {
  return `${paragraphType} ${paragraph} ${section ? 'Abs. ' + section : ''} ${lawCode}`;
}

export function stringifyParagraphCitation({ paragraphType, paragraph, section, sentence, number, lawCode }: ParagraphCitationFragment): string {
  return `${paragraphType} ${paragraph} ${section ? 'Abs. ' + section : ''} ${sentence ? 'S. ' + sentence : ''} ${number ? 'Nr. ' + number : ''} ${lawCode}`;
}
