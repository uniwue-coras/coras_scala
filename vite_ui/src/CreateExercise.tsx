import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatSolutionNodeInput, useCreateExerciseMutation } from './graphql';
import { Navigate } from 'react-router-dom';
import { RawSolutionForm } from './solutionInput/RawSolutionForm';
import update from 'immutability-helper';

interface IState {
  title: string;
  text: string;
}

export function CreateExercise(): ReactElement {

  const { t } = useTranslation('common');
  const [createExercise, { data, loading/*, error*/ }] = useCreateExerciseMutation();

  const [{ title, text }, setState] = useState<IState>({ title: '', text: '' });

  const submit = async (sampleSolution: FlatSolutionNodeInput[]) => {
    if (title.trim().length === 0 || text.trim().length === 0) {
      return;
    }

    try {
      await createExercise({ variables: { exerciseInput: { title, text, sampleSolution } } });
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
        <input id="title" placeholder={t('title')} defaultValue={title} onChange={(event) => setState((state) => update(state, { title: { $set: event.target.value } }))}
          className="mt-2 p-2 rounded border border-slate-600 w-full" />
      </div>

      <div className="my-4">
        <label htmlFor="text" className="font-bold">{t('text')}:</label>
        <textarea id="text" rows={5} placeholder={t('text')} defaultValue={text} onChange={(event) => setState((state) => update(state, { text: { $set: event.target.value } }))}
          className="mt-2 p-2 rounded border border-slate-600 w-full" />
      </div>


      <RawSolutionForm loading={loading} onSubmit={submit} />

    </div>
  );
}
