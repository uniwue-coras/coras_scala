import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {CorrectSolutionView} from './CorrectSolutionView';

export function NewCorrectSolutionContainer(): JSX.Element {

  const {exId, username} = useParams<{ exId: string, username: string }>();

  if (!exId || !username) {
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  return (
    <WithQuery query={useNewCorrectionQuery({variables: {username, exerciseId}})}>
      {({exercise: {sampleSolution, userSolution}}) =>
        <CorrectSolutionView username={username} exerciseId={exerciseId} sampleSolution={sampleSolution} initialUserSolution={userSolution.nodes}
          initialMatches={userSolution.matches}/>}
    </WithQuery>
  );
}
