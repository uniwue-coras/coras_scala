import { Correctness, minimalCorrectness } from './correctness';
import { DefaultSolutionNodeMatchFragment } from './graphql';
import { checkMatchingResultCorrectness } from './matchingResult';

function analyseNodeMatch({ maybeExplanation }: DefaultSolutionNodeMatchFragment): Correctness {
  if (!maybeExplanation) { // certain match
    return Correctness.Correct;
  }

  const { maybeWordMatchingResult, maybeParagraphMatchingResult } = maybeExplanation;

  const wordCorrectness = maybeWordMatchingResult
    ? checkMatchingResultCorrectness(maybeWordMatchingResult!)
    : Correctness.Correct;

  const paragraphCorrectness = maybeParagraphMatchingResult
    ? checkMatchingResultCorrectness(maybeParagraphMatchingResult)
    : Correctness.Correct;

  return minimalCorrectness([wordCorrectness, paragraphCorrectness]);
}

export function analyseMatchingCorrectness(ownMatches: DefaultSolutionNodeMatchFragment[]/*, ownAnnotations: GeneratedAnnotationFragment[]*/): Correctness {
  if (ownMatches.length === 0) { // Not matched...
    return Correctness.Wrong;
  }

  /*
  if (ownAnnotations.length > 0) { // There are annotations...
    return Correctness.Partially;
  }
  */

  const [firstMatch, ...otherMatches] = ownMatches;

  return otherMatches.length > 0
    // TODO: multiple matches
    ? Correctness.Partially
    : analyseNodeMatch(firstMatch);
}
