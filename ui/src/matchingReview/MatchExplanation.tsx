import { ReactElement, useState } from 'react';
import { SolNodeMatchExplanationFragment } from '../graphql';
import { MatchingResultDisplay } from './MatchingResultDisplay';

interface IProps {
  explanation: SolNodeMatchExplanationFragment;
}

interface IState {
  isWord: boolean;
  matchIndex: number;
}

export function SolNodeMatchExplanation({ explanation }: IProps): ReactElement {

  const { wordMatchingResult, maybePararaphMatchingResult } = explanation;
  const [state, setState] = useState<IState>();

  const updateStateFunc = (isWord: boolean) => (matchIndex: number | undefined) => setState(matchIndex !== undefined ? { isWord, matchIndex } : undefined);

  return (
    <>
      <MatchingResultDisplay matchingResult={wordMatchingResult} onHover={updateStateFunc(true)}>
        {({ word }) => <>{word}</>}
      </MatchingResultDisplay>

      {maybePararaphMatchingResult && <MatchingResultDisplay matchingResult={maybePararaphMatchingResult} onHover={updateStateFunc(false)}>
        {({ lawCode, paragraphNumber, paragraphType, rest, section }) =>
          <span>{paragraphType} {paragraphNumber} {section && <>Abs. {section}</>} {rest} {lawCode}</span>}
      </MatchingResultDisplay>}
    </>
  );
}
