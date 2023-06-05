import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {CorrectionStatus, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {CorrectSolutionView} from './CorrectSolutionView';
import {useTranslation} from 'react-i18next';

export function CorrectSolutionContainer(): JSX.Element {

  const {exId, username} = useParams<{ exId: string, username: string }>();
  const {t} = useTranslation('common');

  if (!exId || !username) {
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  return (
    <WithQuery query={useNewCorrectionQuery({variables: {username, exerciseId}})}>
      {({exercise: {sampleSolution, userSolution}}) =>
        userSolution.correctionStatus === CorrectionStatus.Finished
          ? <div>{t('correctionAlreadyFinished!')}</div>
          : <CorrectSolutionView username={username} exerciseId={exerciseId} sampleSolution={sampleSolution} initialUserSolution={userSolution}/>}
    </WithQuery>
  );
}
