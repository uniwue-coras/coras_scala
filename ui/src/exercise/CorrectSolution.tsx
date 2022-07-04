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
      {({exercise: {/*flatSampleSolution, flatUserSolution, */ sampleSolutionAsJson, solutionForUserAsJson}}) => {

        /*
        const xs: FlatSolutionNodeFragment[] = flatSampleSolution;
        const us: FlatSolutionNodeFragment[] | undefined | null = flatUserSolution;
         */

        if (!solutionForUserAsJson) {
          return <Navigate to={homeUrl}/>;
        }

        const correction = newCorrectTree(
          JSON.parse(sampleSolutionAsJson),
          JSON.parse(solutionForUserAsJson)
        );

        return <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={correction}/>;
      }}
    </WithQuery>
  );
}
