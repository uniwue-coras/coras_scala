import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import useAxios from 'axios-hooks';
import {ICorrection} from '../myTsModels';
import {WithQuery} from '../WithQuery';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';

interface IProps {
  exerciseId: number;
}

export function UpdateCorrectionContainer({exerciseId}: IProps): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const [oldCorrectionQuery] = useAxios<ICorrection>({
    url: `/exercises/${exerciseId}/solutions/${username}/?`
  });

  return (
    <WithQuery query={oldCorrectionQuery}>
      {(correction) => <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={correction.rootMatchingResult}/>}
    </WithQuery>
  );
}
