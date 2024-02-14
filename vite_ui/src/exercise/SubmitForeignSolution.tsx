import { WithQuery } from '../WithQuery';
import { ExerciseTaskDefinitionFragment, FlatSolutionNodeInput, useExerciseTaskDefinitionQuery, useSubmitSolutionMutation } from '../graphql';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { RawSolutionForm } from '../solutionInput/RawSolutionForm';
import { homeUrl } from '../urls';
import { ReactElement, useState } from 'react';

interface InnerProps {
  exerciseId: number;
  exercise: ExerciseTaskDefinitionFragment;
}

function Inner({ exerciseId, exercise }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [username, setUsername] = useState('');
  const [submitSolution, { data, loading, error }] = useSubmitSolutionMutation();

  const onSubmit = (solution: FlatSolutionNodeInput[]): void => {
    if (username.trim().length === 0) {
      alert(t('pleaseInsertUsername'));
      return;
    }

    submitSolution({ variables: { exerciseId, userSolution: { username, solution } } })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} {exercise.title}</h1>

      <div className="mt-2 p-2 rounded border border-slate-500">
        {exercise.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="my-2">
        <label className="font-bold">{t('username')}:</label>
        <input defaultValue={username} onChange={event => setUsername(event.target.value)} className="p-2 rounded border border-slate-500 w-full"
          placeholder={t('username') || 'username'} />
      </div>

      {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

      {data?.exerciseMutations?.submitSolution
        ? <div className="mt-4 p-2 rounded bg-green-500 text-white text-center">{t('solutionSubmitted')}</div>
        : <RawSolutionForm loading={loading} onSubmit={onSubmit} />}
    </>
  );
}

export function SubmitForeignSolution(): ReactElement {

  const { exId } = useParams<{ exId: string }>();

  if (!exId) {
    return <Navigate to={homeUrl} />;
  }
  const exerciseId = parseInt(exId);

  const exerciseTaskDefinitionQuery = useExerciseTaskDefinitionQuery({ variables: { exerciseId } });

  return (
    <div className="container mx-auto">
      <WithQuery query={exerciseTaskDefinitionQuery}>
        {({ exercise }) =>
          exercise
            ? <Inner exerciseId={exerciseId} exercise={exercise} />
            : <div>TODO!</div>}
      </WithQuery>
    </div>
  );
}
