import { ReactElement } from 'react';
import { Correctness } from '../graphql';
import { CheckmarkIcon, DashIcon, FullWidthQuestionMarkIcon, WrongIcon } from '../icons';

export function CorrectnessIcon({ correctness }: { correctness: Correctness }): ReactElement {
  return {
    [Correctness.Correct]: <CheckmarkIcon />,
    [Correctness.Partially]: <FullWidthQuestionMarkIcon />,
    [Correctness.Wrong]: <WrongIcon />,
    [Correctness.Unspecified]: <DashIcon />
  }[correctness];
}
