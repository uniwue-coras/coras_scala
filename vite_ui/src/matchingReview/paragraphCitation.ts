import { ParagraphCitationFragment } from "../graphql";

export function stringifyParagraphCitation({ paragraphType, paragraphNumber, section, rest, lawCode }: ParagraphCitationFragment): string {
  return `${paragraphType} ${paragraphNumber} ${section ? 'Abs. ' + section : ''} ${rest} ${lawCode}`;
}
