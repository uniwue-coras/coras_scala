import {EntryCorrectionInput} from '../graphql';
import {TreeMatch} from './correction/corrector';

export function convertEntryMatch({
  // color,
  sampleSolutionEntry: {id: sampleEntryId},
  userSolutionEntry: {id: userEntryId},
  applicabilityComparison
}: TreeMatch): EntryCorrectionInput {

  const {correct: applicabilityCorrect, explanation: applicabilityExplanation} = applicabilityComparison;

  const applicabilityComment: string | undefined = applicabilityExplanation.trim().length > 0
    ? applicabilityExplanation.trim()
    : undefined;

  return {
    sampleEntryId,
    userEntryId,
    applicabilityCorrect,
    applicabilityComment,
    definitionComment: undefined,
    comment: undefined,
    subTextCorrections: [],
  };
}
