import { ReactElement } from 'react';
import { Correctness } from '../graphql';
import { CheckmarkIcon, DashIcon, TildeIcon, WrongIcon } from '../icons';

export function CorrectnessIcon({ correctness }: { correctness: Correctness }): ReactElement {
  return {
    [Correctness.Correct]: <CheckmarkIcon />,
    [Correctness.Partially]: <TildeIcon />,
    [Correctness.Wrong]: <WrongIcon />,
    [Correctness.Unspecified]: <DashIcon />
  }[correctness];
}
