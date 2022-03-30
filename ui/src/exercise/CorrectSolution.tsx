import {Navigate, useParams} from 'react-router-dom';
import {FlatSolutionEntryFragment, useCorrectExerciseQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {SolutionCompareView} from '../solveViews/SolutionCompareView';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {homeUrl} from '../urls';
import {newCorrectTree} from '../model/correction/corrector';
import {inflateEntries} from '../solutionInput/treeNode';

interface IProps {
  exerciseId: number;
  username: string;
  flatSampleSolution: FlatSolutionEntryFragment[];
  flatUserSolution: FlatSolutionEntryFragment[];
}

function createEntry(id: number, index: number, entry: Omit<FlatSolutionEntryFragment, 'id' | 'parentId'>, children: NumberedAnalyzedSolutionEntry[]): NumberedAnalyzedSolutionEntry {
  return {id, index, ...entry, children};
}

function CorrectSolution({exerciseId, username, flatSampleSolution, flatUserSolution}: IProps): JSX.Element {

  const treeMatchResult = newCorrectTree(
    inflateEntries(flatSampleSolution, createEntry),
    inflateEntries(flatUserSolution, createEntry)
  );

  return <SolutionCompareView exerciseId={exerciseId} username={username} treeMatchResult={treeMatchResult}/>;
}

export function CorrectSolutionContainer({exerciseId}: { exerciseId: number }): JSX.Element {

  const {username} = useParams<'username'>();

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  const correctExerciseQuery = useCorrectExerciseQuery({variables: {exerciseId, username}});

  return (
    <div>

      <WithQuery query={correctExerciseQuery}>
        {({exercise}) => <WithNullableNavigate t={exercise}>
          {({sampleSolution, maybeUserSolution}) => <WithNullableNavigate t={maybeUserSolution}>
            {(userSolution) => <CorrectSolution exerciseId={exerciseId} username={username} flatSampleSolution={sampleSolution}
                                                flatUserSolution={userSolution}/>}
          </WithNullableNavigate>}
        </WithNullableNavigate>}
      </WithQuery>

    </div>
  );
}
