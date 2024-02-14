import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {CorrectionStatus, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {CorrectSolutionView} from './CorrectSolutionView';
import {useTranslation} from 'react-i18next';
import {ReactElement} from 'react';

export function CorrectSolutionContainer(): ReactElement {

  const {exId, username} = useParams<{ exId: string, username: string }>();
  const {t} = useTranslation('common');

  if (!exId || !username) {
    // TODO: no navigate!
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  const query = useNewCorrectionQuery({variables: {username, exerciseId}});

  return (
    <WithQuery query={query}>
      {({exercise}) => {

        if (!exercise?.userSolution) {
          return <div>TODO!</div>;
        }

        const {sampleSolution, userSolution} = exercise;

        return userSolution.correctionStatus === CorrectionStatus.Finished
          ? <div>{t('correctionAlreadyFinished!')}</div>
          : <CorrectSolutionView username={username} exerciseId={exerciseId} sampleSolution={sampleSolution} initialUserSolution={userSolution}/>;
      }}
    </WithQuery>
  );
}
