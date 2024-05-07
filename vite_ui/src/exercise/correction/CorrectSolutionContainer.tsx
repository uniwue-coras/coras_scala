import { useNewCorrectionQuery } from '../../graphql';
import { WithQuery } from '../../WithQuery';
import { CorrectSolutionView } from './CorrectSolutionView';
import { ReactElement } from 'react';
import { ParamReturnType, WithRouterParams } from '../../WithRouteParams';
import { isDefined } from '../../funcs';
import { Navigate } from 'react-router-dom';
import { homeUrl } from '../../urls';

interface IProps {
  exerciseId: number;
  username: string;
}

function CorrectSolutionContainerInner({ exerciseId, username }: IProps): ReactElement {
  return (
    <WithQuery query={useNewCorrectionQuery({ variables: { username, exerciseId } })}>
      {({ exercise }) =>
        isDefined(exercise?.userSolution)
          ? <CorrectSolutionView {...{ username, exerciseId }} sampleSolution={exercise.sampleSolution} initialUserSolution={exercise.userSolution} />
          : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

const readParams = ({ exId, username }: ParamReturnType<'exId' | 'username'>) =>
  isDefined(exId) && isDefined(username) ? { exerciseId: parseInt(exId), username } : undefined;

export function CorrectSolutionContainer(): ReactElement {
  return (
    <WithRouterParams readParams={readParams}>
      {(params) => <CorrectSolutionContainerInner {...params} />}
    </WithRouterParams>
  );
}
