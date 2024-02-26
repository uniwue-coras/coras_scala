import { CorrectionStatus, useNewCorrectionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { CorrectSolutionView } from './CorrectSolutionView';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import { ParamReturnType, WithRouterParams } from '../WithRouteParams';

interface IProps {
  exerciseId: number;
  username: string;
}

export function CorrectSolutionContainerInner({ exerciseId, username }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const query = useNewCorrectionQuery({ variables: { username, exerciseId } });

  return (
    <WithQuery query={query}>
      {({ exercise }) => {

        if (!exercise?.userSolution) {
          return <div>TODO!</div>;
        }

        const { sampleSolution, userSolution } = exercise;

        return userSolution.correctionStatus === CorrectionStatus.Finished
          ? <div>{t('correctionAlreadyFinished!')}</div>
          : <CorrectSolutionView username={username} exerciseId={exerciseId} sampleSolution={sampleSolution} initialUserSolution={userSolution} />;
      }}
    </WithQuery>
  );
}

const readParams = ({ exId, username }: ParamReturnType<'exId' | 'username'>) => {
  return exId !== undefined && username !== undefined
    ? { exerciseId: parseInt(exId), username }
    : undefined;
};

export function CorrectSolutionContainer(): ReactElement {
  return (
    <WithRouterParams readParams={readParams}>
      {(params) => <CorrectSolutionContainerInner {...params} />}
    </WithRouterParams>
  );
}
