import { Link } from 'react-router-dom';
import { ReactElement } from 'react';
import { CheckeredFlagIcon, RunnerIcon } from '../icons';

interface IProps {
  username: string;
  exerciseId: number;
  correctionFinished: boolean;
}

export function UserSolutionOverviewBox({ username, exerciseId, correctionFinished }: IProps): ReactElement {
  return (
    <Link className="p-2 rounded border border-slate-500 text-blue-600 text-center w-full" to={`/exercises/${exerciseId}/solutions/${username}/correctSolution`}>
      {username} {correctionFinished ? <CheckeredFlagIcon /> : <RunnerIcon />}
    </Link>
  );
}
