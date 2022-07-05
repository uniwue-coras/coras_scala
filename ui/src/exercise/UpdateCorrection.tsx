import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {WithQuery} from '../WithQuery';
import {useUpdateCorrectionValuesQuery} from '../graphql';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';

interface IProps {
  exerciseId: number;
}

export function UpdateCorrectionContainer({exerciseId}: IProps): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const query = useUpdateCorrectionValuesQuery({variables: {exerciseId, username}});

  return (
    <WithQuery query={query}>
      {(data) => {
        if (!data.exercise.correctionForUserAsJson) {
          return <Navigate to={homeUrl}/>;
        }

        return <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={JSON.parse(data.exercise.correctionForUserAsJson)}/>;
      }}
    </WithQuery>
  );
}
