import { useState } from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTaskDefinition, ExerciseTaskDefinitionForm} from './ExerciseTaskDefinitionForm';
import {AnalyzedSolutionEntry} from './solutionInput/solutionEntryNode';
import {FlatSolutionEntryInput, useAddExerciseMutation} from './graphql';
import {flattenEntries} from './solutionInput/treeNode';
import {HiCheck, HiX} from 'react-icons/hi';
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
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('createExercise')}</h1>

      {exerciseTaskDefinition
        ? <>
          <div className="box"><HiCheck/> {t('taskDefinitionProvided')}</div>
          <SubmitSolutionForm onSubmit={(entries) => submit(exerciseTaskDefinition, entries)} loading={loading}/>
        </>
        : <>
          <div className="box"><HiX/> {t('taskDefinitionNotProvided')}</div>

          <ExerciseTaskDefinitionForm onSubmit={setExerciseTaskDefinition}/>
        </>}

      {error && <div className="notification is-danger has-text-centered my-3">{error.message}</div>}

      {!!data && data.adminMutations && data.adminMutations.addExercise && <div className="notification is-success has-text-centered my-3">
        {t('exerciseCreated{{id}}', {id: data.adminMutations.addExercise})}
      </div>}

    </div>
  );
}
