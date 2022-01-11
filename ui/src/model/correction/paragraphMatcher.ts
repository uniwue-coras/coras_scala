import {ParagraphCitationFragment, ParagraphCitationInput} from '../../graphql';
import {combinedMatching, CombinedMatchingResult} from '../matching/combinedMatching';

export interface AmbiguousParagraphCitationAssessment {
  certainty: number;
}

export type ParagraphMatchingResult = CombinedMatchingResult<ParagraphCitationFragment, AmbiguousParagraphCitationAssessment>;

function paragraphComparator(paragraph1: ParagraphCitationFragment, paragraph2: ParagraphCitationFragment): boolean {
  const {paragraphType: t1, paragraph: p1, subParagraph: sp1, sentence: s1, lawCode: lc1} = paragraph1;
  const {paragraphType: t2, paragraph: p2, subParagraph: sp2, sentence: s2, lawCode: lc2} = paragraph2;

  return t1 === t2 && p1 === p2 && sp1 === sp2 && s1 === s2 && lc1 === lc2;
}

function assessAmbiguousParagraphMatchCertainty(paragraph1: ParagraphCitationInput, paragraph2: ParagraphCitationInput): AmbiguousParagraphCitationAssessment {

  const {paragraphType: t1, paragraph: p1, subParagraph: sp1, sentence: s1, lawCode: lc1} = paragraph1;
  const {paragraphType: t2, paragraph: p2, subParagraph: sp2, sentence: s2, lawCode: lc2} = paragraph2;

  const paragraphPoints = p1 === p2 ? 0.5 : 0;
  const subParagraphPoints = sp1 === sp2 ? 0.2 : 0;
  const sentencePoints = s1 === s2 ? 0.1 : 0;
  const typePoints = t1 === t2 ? 0.1 : 0;
  const lawCodePoints = lc1 === lc2 ? 0.1 : 0;

  return {certainty: paragraphPoints + subParagraphPoints + sentencePoints + typePoints + lawCodePoints};
}

export function compareParagraphCitations(sampleParagraphs: ParagraphCitationFragment[], userParagraphs: ParagraphCitationFragment[]): ParagraphMatchingResult {
  return combinedMatching(sampleParagraphs, userParagraphs, paragraphComparator, assessAmbiguousParagraphMatchCertainty);
}
