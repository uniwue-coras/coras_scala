import { Navigate, useParams } from 'react-router-dom';
import { homeUrl } from '../urls';
import { CorrectionStatus, useNewCorrectionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { CorrectSolutionView } from './CorrectSolutionView';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

export function CorrectSolutionContainer(): ReactElement {

  const { t } = useTranslation('common');
  const { exId, username } = useParams<'exId' | 'username'>();

  if (exId === undefined || username === undefined) {
    return <Navigate to={homeUrl} />;
  }

  const exerciseId = parseInt(exId);
  const query = useNewCorrectionQuery({ variables: { username, exerciseId } });

  return (
    <WithQuery query={query}>
      {({ exercise }) => {

        if (!exercise?.userSolution) {
          return <div className="container mx-auto">{t('loadDataError')}</div>;
        }

        const { sampleSolution, userSolution } = exercise;

        return userSolution.correctionStatus !== CorrectionStatus.Finished
          ? <CorrectSolutionView {...{ username, exerciseId, sampleSolution }} initialUserSolution={userSolution} />
          : <div>{t('correctionAlreadyFinished!')}</div>;
      }}
    </WithQuery>
  );
}
