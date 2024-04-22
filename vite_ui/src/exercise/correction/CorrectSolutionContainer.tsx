import { useNewCorrectionQuery } from '../../graphql';
import { WithQuery } from '../../WithQuery';
import { CorrectSolutionView } from './CorrectSolutionView';
import { ReactElement } from 'react';
import { ParamReturnType, WithRouterParams } from '../../WithRouteParams';
import { assertDefined, isDefined } from '../../funcs';
import { Navigate } from 'react-router-dom';
import { homeUrl } from '../../urls';

interface IProps {
  exerciseId: number;
  username: string;
}

function CorrectSolutionContainerInner({ exerciseId, username }: IProps): ReactElement {

  return (
    <WithQuery query={useNewCorrectionQuery({ variables: { username, exerciseId } })}>
      {({ exercise }) => assertDefined(
        exercise,
        () => <Navigate to={homeUrl} />,
        ({ sampleSolution, userSolution }) => assertDefined(
          userSolution,
          () => <Navigate to={homeUrl} />,
          (initialUserSolution) => <CorrectSolutionView {...{ username, exerciseId, sampleSolution, initialUserSolution }} />
        )
      )}
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
