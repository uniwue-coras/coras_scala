import { ReactElement } from 'react';
import { SolNodeMatchExplanationFragment } from '../../graphql';
import { MatchingResultDisplay } from './MatchingResultDisplay';
import { stringifyParagraphCitation } from '../../paragraph';

interface IProps {
  explanation: SolNodeMatchExplanationFragment;
  onMouseEnter: (isWord: boolean, explanationIndex: number) => void;
  onMouseLeave: () => void;
}

export function SolNodeMatchExplanation({ explanation, onMouseEnter, onMouseLeave }: IProps): ReactElement {

  const { maybeWordMatchingResult, maybePararaphMatchingResult } = explanation;

  const updateStateFunc = (isWord: boolean) => (matchIndex: number | undefined) =>
    matchIndex !== undefined ? onMouseEnter(isWord, matchIndex) : onMouseLeave();

  return (
    <>
      {maybeWordMatchingResult && <MatchingResultDisplay matchingResult={maybeWordMatchingResult} onHover={updateStateFunc(true)}>
        {({ word }) => <span>{word}</span>}
      </MatchingResultDisplay>}

      {maybePararaphMatchingResult && <MatchingResultDisplay matchingResult={maybePararaphMatchingResult} onHover={updateStateFunc(false)}>
        {(paragraphCitation) => <span>{stringifyParagraphCitation(paragraphCitation)}</span>}
      </MatchingResultDisplay>}
    </>
  );
}
