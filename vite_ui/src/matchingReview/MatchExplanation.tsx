import { ReactElement } from 'react';
import { SolNodeMatchExplanationFragment } from '../graphql';
import { MatchingResultDisplay } from './MatchingResultDisplay';
import { stringifyParagraphCitation } from '../paragraph';
import { useTranslation } from 'react-i18next';

interface IProps {
  explanation: SolNodeMatchExplanationFragment;
  onMouseEnter: (isWord: boolean, explanationIndex: number) => void;
  onMouseLeave: () => void;
}

export function SolNodeMatchExplanation({ explanation, onMouseEnter, onMouseLeave }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { wordMatchingResult, maybePararaphMatchingResult } = explanation;

  const updateStateFunc = (isWord: boolean) => (matchIndex: number | undefined) =>
    matchIndex !== undefined ? onMouseEnter(isWord, matchIndex) : onMouseLeave();

  return (
    <>
      <MatchingResultDisplay name={t('wordMatching')} matchingResult={wordMatchingResult} onHover={updateStateFunc(true)}>
        {({ word }) => <>{word}</>}
      </MatchingResultDisplay>

      {maybePararaphMatchingResult && <MatchingResultDisplay name={t('paragraphMatching')} matchingResult={maybePararaphMatchingResult} onHover={updateStateFunc(false)}>
        {(paragraphCitation) => <span>{stringifyParagraphCitation(paragraphCitation)}</span>}
      </MatchingResultDisplay>}
    </>
  );
}
