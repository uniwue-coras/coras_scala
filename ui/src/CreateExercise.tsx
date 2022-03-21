import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTaskDefinition, ExerciseTaskDefinitionForm} from './ExerciseTaskDefinitionForm';
import {AnalyzedSolutionEntry} from './solutionInput/solutionEntryNode';
import {FlatSolutionEntryInput, useAddExerciseMutation} from './graphql';
import {flattenEntries} from './solutionInput/treeNode';
import {SubmitSolutionForm} from './exercise/SubmitSolutionForm';

export function CreateExercise(): JSX.Element {

  const {t} = useTranslation('common');
  const [createExercise, {data, loading, error}] = useAddExerciseMutation();

  const [exerciseTaskDefinition, setExerciseTaskDefinition] = useState<ExerciseTaskDefinition>();

  function submit({title, text}: ExerciseTaskDefinition, entries: AnalyzedSolutionEntry[]): void {
    const sampleSolution: FlatSolutionEntryInput[] = flattenEntries(
      entries,
      (rest, id, parentId) => ({...rest, id, parentId})
    )[0];

    createExercise({variables: {exerciseInput: {title, text, sampleSolution}}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('createExercise')}</h1>

      {exerciseTaskDefinition
        ? <>
          <div className="mt-4 p-4 rounded border border-slate-600">&#10003; {t('taskDefinitionProvided')}</div>

          <SubmitSolutionForm onSubmit={(entries) => submit(exerciseTaskDefinition, entries)} loading={loading}/>
        </>
        : <>
          <div className="mt-4 p-4 rounded border border-slate-600">&#10006; {t('taskDefinitionNotProvided')}</div>

          <ExerciseTaskDefinitionForm onSubmit={setExerciseTaskDefinition}/>
        </>}

      {error && <div className="notification is-danger has-text-centered my-3">{error.message}</div>}

      {!!data && data.adminMutations && data.adminMutations.addExercise && <div className="notification is-success has-text-centered my-3">
        {t('exerciseCreated{{id}}', {id: data.adminMutations.addExercise})}
      </div>}

    </div>
  );
}
