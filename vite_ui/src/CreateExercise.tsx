import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatSolutionNodeInput, useCreateExerciseMutation } from './graphql';
import { Navigate } from 'react-router-dom';
import { RawSolutionForm } from './solutionInput/RawSolutionForm';


export function CreateExercise(): ReactElement {

  const { t } = useTranslation('common');
  const [createExercise, { data, loading/*, error*/ }] = useCreateExerciseMutation();

  const [title, setTitle] = useState('');

  const submit = async (sampleSolution: FlatSolutionNodeInput[]) => {
    if (title.length === 0) {
      return;
    }

    try {
      await createExercise({ variables: { exerciseInput: { title, sampleSolution } } });
    } catch (error) {
      console.error(error);
    }
  };

  if (data?.createExercise) {
    return <Navigate to={`/exercises/${data.createExercise}`} />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('createExercise')}</h1>

      <div className="my-4">
        <label htmlFor="title" className="font-bold">{t('title')}:</label>
        <input id="title" placeholder={t('title')} defaultValue={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 p-2 rounded border border-slate-600 w-full" />
      </div>

      <RawSolutionForm loading={loading} onSubmit={submit} />

    </div>
  );
}
