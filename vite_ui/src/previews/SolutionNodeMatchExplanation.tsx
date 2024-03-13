import { ReactElement } from 'react';
import { SolNodeMatchExplanationFragment } from '../graphql';
import { MatchingResultDisplay } from './MatchingResultDisplay';
import { stringifyParagraphCitation } from '../paragraph';

interface IProps {
  explanation: SolNodeMatchExplanationFragment;
}

export function SolutionNodeMatchExplanation({ explanation }: IProps): ReactElement {

  const { maybeWordMatchingResult, maybeParagraphMatchingResult } = explanation;

  return (
    <>
      {maybeWordMatchingResult && <MatchingResultDisplay matchingResult={maybeWordMatchingResult}>
        {({ word }) => <span>{word}</span>}
      </MatchingResultDisplay>}

      {maybeParagraphMatchingResult && <MatchingResultDisplay matchingResult={maybeParagraphMatchingResult}>
        {(paragraphCitation) => <span>{stringifyParagraphCitation(paragraphCitation)}</span>}
      </MatchingResultDisplay>}
    </>
  );
}
