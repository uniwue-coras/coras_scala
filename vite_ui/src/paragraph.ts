import { ParagraphCitationFragment, ParagraphIdentifierFragment } from './graphql';

export function paragraphIdentifiersEqual(p1: ParagraphIdentifierFragment, p2: ParagraphIdentifierFragment): boolean {
  return p1.paragraphType === p2.paragraphType && p1.paragraph === p2.paragraph && p1.subParagraph === p2.subParagraph && p1.lawCode === p2.lawCode;
}

export function stringifyParagraphIdentifier({ paragraphType, paragraph, subParagraph, lawCode }: ParagraphIdentifierFragment): string {
  return `${paragraphType} ${paragraph} ${subParagraph ? 'Abs. ' + subParagraph : ''} ${lawCode}`;
}

export function stringifyParagraphCitation({ paragraphType, paragraph, subParagraph, sentence, number, lawCode }: ParagraphCitationFragment): string {
  return `${paragraphType} ${paragraph} ${subParagraph ? 'Abs. ' + subParagraph : ''} ${sentence ? 'S. ' + sentence : ''} ${number ? 'Nr. ' + number : ''} ${lawCode}`;
}
