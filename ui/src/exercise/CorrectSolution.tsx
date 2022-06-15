import {Navigate, useParams} from 'react-router-dom';
import {WithQuery} from '../WithQuery';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';
import {homeUrl} from '../urls';
import {newCorrectTree} from '../model/correction/corrector';
import {CorrectionValues} from './correctionValues';
import useAxios from 'axios-hooks';

interface IProps {
  exerciseId: number;
}

export function CorrectSolutionContainer({exerciseId}: IProps): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const [sampleSolutionQuery] = useAxios<CorrectionValues>({
    url: `/exercises/${exerciseId}/solutions/${username}/correctionValues`
  });

  return (
    <WithQuery query={sampleSolutionQuery}>
      {({sampleSolution, userSolution}) =>
        <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={newCorrectTree(sampleSolution, userSolution)}/>
      }
    </WithQuery>
  );
}
