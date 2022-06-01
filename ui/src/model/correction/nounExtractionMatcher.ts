import {levenshtein} from '../../levenshtein';
import {NumberedAnalyzedSolutionEntry} from '../../solutionInput/solutionEntryNode';
import {AmbiguousAssessment, AmbiguousMatchFunc, combinedMatching, CombinedMatchingResult, combinedMatchingResultQuality, MatchFunc} from '@coras/matching';

const maxWeightedDistance = 0.1;

const nounRegex = /([A-Z][A-Za-z])+/ug;

function extractNouns(text: string): string[] {
  return Array.from(text.matchAll(nounRegex)).map((m) => m[0]);
}

const stringEqualityCheck: MatchFunc<string> = (x, y) => x === y;

const levenshteinAgreementCheck: AmbiguousMatchFunc<string> = (x, y) => {
  // FIXME: make ambiguous match!
  const distance = levenshtein(x, y);

  const certainty = distance / Math.max(x.length, y.length);

  return distance <= 2 || certainty <= maxWeightedDistance
    ? {certainty}
    : undefined;
};

export interface NounExtractionResult extends AmbiguousAssessment {
  correctionType: 'NounExtraction';
  matchingResult: CombinedMatchingResult<string>;
  certainty: number;
}


export const nounExtractionMatcher: AmbiguousMatchFunc<NumberedAnalyzedSolutionEntry, NounExtractionResult> = ({text: sampleText}, {text: userText}) => {

  const matchingResult: CombinedMatchingResult<string> = combinedMatching(
    extractNouns(sampleText),
    extractNouns(userText),
    stringEqualityCheck,
    levenshteinAgreementCheck
  );

  const certainty = combinedMatchingResultQuality(matchingResult);

  return certainty > 0.6
    ? {correctionType: 'NounExtraction', matchingResult, certainty}
    : undefined;
};
