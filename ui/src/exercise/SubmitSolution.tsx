import {WithQuery} from '../WithQuery';
import {ExerciseTaskDefinitionFragment, useExerciseTaskDefinitionQuery, useSubmitSolutionMutation} from '../graphql';
import {enumerateEntries, flattenNode, RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {Navigate, useParams} from 'react-router-dom';
import {RawSolutionForm} from '../solutionInput/RawSolutionForm';
import {homeUrl} from '../urls';

interface InnerProps extends IProps {
  maybeUsername: string | undefined;
  exercise: ExerciseTaskDefinitionFragment;
}

function Inner({exerciseId, maybeUsername, exercise}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');
  const [submitSolution, {data, loading, error}] = useSubmitSolutionMutation();

  if (!exercise) {
    return <Navigate to={homeUrl}/>;
  }

  function onSubmit(children: RawSolutionEntry[]): void {
    const solution = enumerateEntries(children).flatMap((n) => flattenNode(n, undefined));

    submitSolution({variables: {exerciseId, userSolution: {maybeUsername, solution}}})
      .catch((error) => console.error(error));
  }

  return (
    <>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} {exercise.title}</h1>

      <div className="mt-2 p-2 rounded border border-slate-500">
        {exercise.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

      {data?.exerciseMutations?.submitSolution
        ? <div className="mt-4 p-2 rounded bg-green-500 text-white text-center">{t('solutionSubmitted')}</div>
        : <RawSolutionForm loading={loading} onSubmit={onSubmit}/>}
    </>
  );

}

interface IProps {
  exerciseId: number;
}

export function SubmitSolution({exerciseId}: IProps): JSX.Element {

  const maybeUsername = useParams<'username'>().username;
  const exerciseTaskDefinitionQuery = useExerciseTaskDefinitionQuery({variables: {exerciseId}});

  return (
    <div className="container mx-auto">
      <WithQuery query={exerciseTaskDefinitionQuery}>
        {({exercise}) => <Inner exerciseId={exerciseId} maybeUsername={maybeUsername} exercise={exercise}/>}
      </WithQuery>
    </div>
  );
}
