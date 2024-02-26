import { ParagraphCitationFragment, ParagraphIdentifierFragment } from './graphql';

export function paragraphIdentifiersEqual(p1: ParagraphIdentifierFragment, p2: ParagraphIdentifierFragment): boolean {
  return p1.paragraphType === p2.paragraphType && p1.paragraphNumber === p2.paragraphNumber && p1.section === p2.section && p1.lawCode === p2.lawCode;
}

export function stringifyParagraphIdentifier({ paragraphType, paragraphNumber, section, lawCode }: ParagraphIdentifierFragment): string {
  return `${paragraphType} ${paragraphNumber} Abs. ${section} ${lawCode}`;
}


export function stringifyParagraphCitation({ paragraphType, paragraphNumber, section, rest, lawCode }: ParagraphCitationFragment): string {
  return `${paragraphType} ${paragraphNumber} ${section ? 'Abs. ' + section : ''} ${rest} ${lawCode}`;
}
