import { ReactElement } from 'react';
import { SolNodeMatchExplanationFragment } from '../graphql';
import { MatchingResultDisplay } from './MatchingResultDisplay';
import { stringifyParagraphCitation } from '../paragraph';

interface IProps {
  explanation: SolNodeMatchExplanationFragment;
}

export function SolutionNodeMatchExplanation({ explanation }: IProps): ReactElement {

  const { maybeWordMatchingResult, maybePararaphMatchingResult, maybeDirectChildrenMatchingResult } = explanation;

  console.info(JSON.stringify(maybeDirectChildrenMatchingResult, null, 2));

  return (
    <>
      {maybeWordMatchingResult && <MatchingResultDisplay matchingResult={maybeWordMatchingResult}>
        {({ word }) => <span>{word}</span>}
      </MatchingResultDisplay>}

      {maybePararaphMatchingResult && <MatchingResultDisplay matchingResult={maybePararaphMatchingResult}>
        {(paragraphCitation) => <span>{stringifyParagraphCitation(paragraphCitation)}</span>}
      </MatchingResultDisplay>}
    </>
  );
}
