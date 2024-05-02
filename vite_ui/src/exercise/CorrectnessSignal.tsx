import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Correctness } from '../graphql';
import { CorrectnessIcon } from './CorrectnessIcon';
import { correctnessBorderColor, correctnessTextColor } from '../model/correctness';
import classNames from 'classnames';

interface IProps {
  letter: string;
  correctness: Correctness;
  onClick: () => void;
}

export function CorrectnessSignal({ letter, correctness, onClick }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const textColor = correctnessTextColor(correctness);
  const borderColor = correctnessBorderColor(correctness);

  const title = {
    [Correctness.Correct]: t('correct'),
    [Correctness.Partially]: t('partiallyCorrect'),
    [Correctness.Wrong]: t('wrong'),
    [Correctness.Unspecified]: t('unspecified')
  }[correctness];

  return (
    <button type="button" className={classNames('p-2 rounded border font-extrabold bg-white', borderColor, textColor)} title={title} onClick={onClick}>
      {letter} <CorrectnessIcon correctness={correctness} />
    </button>
  );
}
