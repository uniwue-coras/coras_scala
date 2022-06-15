import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTaskDefinition, ExerciseTaskDefinitionForm} from './ExerciseTaskDefinitionForm';
import {enumerateEntries, RawSolutionEntry} from './solutionInput/solutionEntryNode';
import {RawSolutionForm} from './solutionInput/RawSolutionForm';
import {INewExerciseInput} from './myTsModels';
import useAxios from 'axios-hooks';

export function CreateExercise(): JSX.Element {

  const {t} = useTranslation('common');

  const [{data, loading, error}, executeCreateExercise] = useAxios<number, INewExerciseInput>({
    url: '/exercises',
    headers: {'Content-Type': 'application/json'},
    method: 'post'
  }, {manual: true});

  const [exerciseTaskDefinition, setExerciseTaskDefinition] = useState<ExerciseTaskDefinition>();

  function submit({title, text}: ExerciseTaskDefinition, entries: RawSolutionEntry[]): void {
    executeCreateExercise({data: {title, text, sampleSolution: enumerateEntries(entries)[0]}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('createExercise')}</h1>

      {data !== undefined
        ? <div className="mt-4 p-2 rounded bg-green-500 text-white text-center">
          {t('exerciseCreated{{id}}', {id: data})}
        </div>
        : <>
          {exerciseTaskDefinition
            ? <>
              <div className="mt-4 p-4 rounded border border-slate-600">&#10003; {t('taskDefinitionProvided')}</div>

              <RawSolutionForm loading={loading} onSubmit={(entries) => submit(exerciseTaskDefinition, entries)}/>
            </>
            : <>
              <div className="mt-4 p-4 rounded border border-slate-600">&#10006; {t('taskDefinitionNotProvided')}</div>

              <ExerciseTaskDefinitionForm onSubmit={setExerciseTaskDefinition}/>
            </>}

          {error && <div className="notification is-danger has-text-centered my-3">{error.message}</div>}
        </>}
    </div>
  );
}
