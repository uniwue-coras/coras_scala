import {Navigate, useParams} from 'react-router-dom';
import {WithQuery} from '../WithQuery';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';
import {homeUrl} from '../urls';
import {newCorrectTree} from '../model/correction/corrector';
import {useCorrectSolutionValuesQuery} from '../graphql';

interface IProps {
  exerciseId: number;
}

export function CorrectSolutionContainer({exerciseId}: IProps): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const query = useCorrectSolutionValuesQuery({variables: {exerciseId, username}});

  return (
    <WithQuery query={query}>
      {(data) => {
        if (data && data.exercise && data.exercise.solutionForUserAsJson) {

          const correction = newCorrectTree(
            JSON.parse(data.exercise.sampleSolutionAsJson),
            JSON.parse(data.exercise.solutionForUserAsJson)
          );

          return <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={correction}/>;
        } else {
          return <Navigate to={homeUrl}/>;
        }
      }
      }
    </WithQuery>
  );
}
