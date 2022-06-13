import {Navigate, useParams} from 'react-router-dom';
import {WithQuery} from '../WithQuery';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';
import {homeUrl} from '../urls';
import {newCorrectTree} from '../model/correction/corrector';
import {CorrectionValues} from './correctionValues';
import {myUseAxios} from '../index';

interface IProps {
  exerciseId: number;
}

export function CorrectSolutionContainer({exerciseId}: IProps): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const [sampleSolutionQuery] = myUseAxios<CorrectionValues>({
    url: `/exercises/${exerciseId}/userSolution/${username}/correctionValues`
  });

  return (
    <WithQuery query={sampleSolutionQuery}>
      {({sampleSolution, userSolution}) =>
        <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={newCorrectTree(sampleSolution, userSolution)}/>
      }
    </WithQuery>
  );
}
