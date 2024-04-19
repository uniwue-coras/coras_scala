import { ReactElement } from 'react';
import { CheckmarkIcon, DashIcon, FullWidthQuestionMarkIcon, WrongIcon } from '../icons';
import { Correctness } from '../correctness';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

interface IProps {
  letter: string;
  correctness: Correctness;
  onClick: () => void;
}

export function CorrectnessSignal({ letter, correctness, onClick }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const textColor = {
    [Correctness.Correct]: 'text-green-500',
    [Correctness.Partially]: 'text-yellow-500',
    [Correctness.Wrong]: 'text-red-500',
    [Correctness.Unspecified]: 'text-slate-500'
  }[correctness];

  const borderColor = {
    [Correctness.Correct]: 'border-green-500',
    [Correctness.Partially]: 'border-yellow-500',
    [Correctness.Wrong]: 'border-red-500',
    [Correctness.Unspecified]: 'text-slate-400'
  }[correctness];

  const icon = {
    [Correctness.Correct]: <CheckmarkIcon />,
    [Correctness.Partially]: <FullWidthQuestionMarkIcon />,
    [Correctness.Wrong]: <WrongIcon />,
    [Correctness.Unspecified]: <DashIcon />
  }[correctness];

  const title = {
    [Correctness.Correct]: t('correct'),
    [Correctness.Partially]: t('partiallyCorrect'),
    [Correctness.Wrong]: t('wrong'),
    [Correctness.Unspecified]: t('unspecified')

  }[correctness];

  return (
    <div className={classNames('p-2 rounded border font-extrabold', borderColor, textColor)} title={title} onClick={onClick}>
      {letter} {icon}
    </div>
  );
}
