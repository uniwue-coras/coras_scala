import {Fragment} from 'react';
import classNames from 'classnames';
import {Correctness} from './SolutionTableRow';

interface IProps {
  correctness: Correctness;
}

export function CorrectnessLights({correctness}: IProps): JSX.Element {
  return (
    <Fragment>
      <span className={classNames({'text-green-500': correctness === Correctness.COMPLETE})}>&#9679;</span>
      <span className={classNames({'text-yellow-500': correctness === Correctness.PARTIAL})}>&#9679;</span>
      <span className={classNames({'text-red-500': correctness === Correctness.NONE})}>&#9679;</span>
    </Fragment>
  );
}
