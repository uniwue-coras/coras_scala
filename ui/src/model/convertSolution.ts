import {EntryCorrectionInput, ParagraphCitationCorrectionInput} from '../graphql';
import {ParagraphMatchingResult} from './correction/paragraphMatcher';
import {TreeMatch} from './correction/corrector';


function convertParagraphMatch({certainMatches, ambiguousMatches}: ParagraphMatchingResult): ParagraphCitationCorrectionInput[] {
  return [
    ...certainMatches.map(({sampleSolutionEntry, userSolutionEntry}) => ({
      sampleParagraphCitationId: sampleSolutionEntry.id,
      userParagraphCitationId: userSolutionEntry.id,
      comment: undefined
    }))
  ];
}

export function convertEntryMatch({
  // color,
  sampleSolutionEntry: {id: sampleEntryId},
  userSolutionEntry: {id: userEntryId},
  analysis: {
    paragraphMatch,
    applicabilityComparison
  }
}: TreeMatch): EntryCorrectionInput {

  const {correct: applicabilityCorrect, explanation: applicabilityExplanation} = applicabilityComparison;

  const applicabilityComment: string | undefined = applicabilityExplanation.trim().length > 0
    ? applicabilityExplanation.trim()
    : undefined;

  const paragraphCitationCorrections: ParagraphCitationCorrectionInput[] = paragraphMatch
    ? convertParagraphMatch(paragraphMatch)
    : [];


  return {
    sampleEntryId,
    userEntryId,
    applicabilityCorrect,
    applicabilityComment,
    definitionComment: undefined,
    comment: undefined,
    paragraphCitationCorrections,
    subTextCorrections: [],
  };
}
