import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExerciseTextBlockGroup, useDeleteExerciseTextBlockGroupMutation, useExerciseTextBlockManagementQuery, useSubmitExerciseTextBlockGroupMutation, useUpdateExerciseTextBlockGroupMutation } from '../graphql';
import { WithQuery } from '../WithQuery';
import { PlusIcon } from '../icons';
import { executeMutation } from '../mutationHelpers';
import { isDefined } from '../funcs';
import { ExerciseTextBlockGroupForm } from './ExerciseTextBlockGroupForm';
import update from 'immutability-helper';


interface IProps {
  exerciseId: number;
  title: string;
  textBlockGroups: ExerciseTextBlockGroup[];
}

interface IState {
  textBlockGroups: (ExerciseTextBlockGroup & { changed?: boolean })[];
  newGroups: string[][];
}

function Inner({ exerciseId, title, textBlockGroups: initialTextBlockGroups }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [{ textBlockGroups, newGroups }, setState] = useState<IState>({ textBlockGroups: initialTextBlockGroups, newGroups: [] });
  const [submitNewGroup] = useSubmitExerciseTextBlockGroupMutation();
  const [deleteGroup] = useDeleteExerciseTextBlockGroupMutation();
  const [updateGroup] = useUpdateExerciseTextBlockGroupMutation();

  const addNewGroup = () => setState((state) => update(state, { newGroups: { $push: [[]] } }));
  const deleteNewGroup = (groupIndex: number) => setState((state) => update(state, { newGroups: { $splice: [[groupIndex, 1]] } }));

  const addContentToNewGroup = (groupIndex: number) => setState((state) => update(state, { newGroups: { [groupIndex]: { $push: [''] } } }));

  const updateContentInNewGroup = (groupIndex: number, contentIndex: number, text: string) => setState((state) => update(state, {
    newGroups: { [groupIndex]: { [contentIndex]: { $set: text } } }
  }));

  const onSubmitNewGroup = (groupIndex: number) => {
    const contents = newGroups[groupIndex].map((c) => c.trim()).filter((c) => c.length > 0);

    // check new group not empty?
    if (contents.length === 0) { return; }

    executeMutation(
      () => submitNewGroup({ variables: { exerciseId, contents } }),
      ({ exerciseMutations }) => {
        const newGroup = exerciseMutations?.submitTextBlockGroup;
        isDefined(newGroup) && setState((state) => update(state, { textBlockGroups: { $push: [newGroup] }, newGroups: { $splice: [[groupIndex, 1]] } }));
      }
    );
  };

  const addContentToGroup = (groupIndex: number) => setState((state) => update(state, { textBlockGroups: { [groupIndex]: { textBlocks: { $push: [''] }, changed: { $set: true } } } }));

  const onUpdateGroup = (groupIndex: number) => {
    const { groupId, textBlocks } = textBlockGroups[groupIndex];

    executeMutation(
      () => updateGroup({ variables: { exerciseId, groupId, contents: textBlocks } }),
      ({ exerciseMutations }) => {
        const updatedGroup = exerciseMutations?.textBlockGroup?.update;
        isDefined(updatedGroup) && setState((state) => update(state, { textBlockGroups: { [groupIndex]: { $set: updatedGroup } } }));
      }
    );
  };

  const updateContentInGroup = (groupIndex: number, contentIndex: number, newContent: string) => setState((state) => update(state, {
    textBlockGroups: { [groupIndex]: { textBlocks: { [contentIndex]: { $set: newContent } } } }
  }));

  const onDeleteGroup = (groupIndex: number) => {
    const { groupId } = textBlockGroups[groupIndex];

    if (!confirm(t('reallyDeleteGroup'))) { return; }

    executeMutation(
      () => deleteGroup({ variables: { exerciseId, groupId } }),
      ({ exerciseMutations }) => {
        isDefined(exerciseMutations?.textBlockGroup?.delete) && setState((state) => update(state, { textBlockGroups: { $splice: [[groupIndex, 1]] } }));
      }
    );
  };

  return (
    <div className="my-4">
      <h2 className="mt-2 font-bold">{t('exercise')} &quot;{title}&quot;</h2>

      {textBlockGroups.map(({ groupId, textBlocks, changed }, groupIndex) => <div key={groupId}>
        <h2 className="mt-2 font-bold">{t('group')} {groupId}</h2>

        <ExerciseTextBlockGroupForm key={groupId} textBlocks={textBlocks} changed={!!changed}
          updateContent={(contentIndex, newContent) => updateContentInGroup(groupIndex, contentIndex, newContent)}
          addContent={() => addContentToGroup(groupIndex)} deleteGroup={() => onDeleteGroup(groupIndex)} submitGroup={() => onUpdateGroup(groupIndex)} />
      </div>)}

      {newGroups.map((textBlocks, groupIndex) =>
        <ExerciseTextBlockGroupForm key={groupIndex} textBlocks={textBlocks} changed={true} updateContent={(contentIndex, newContent) => updateContentInNewGroup(groupIndex, contentIndex, newContent)}
          addContent={() => addContentToNewGroup(groupIndex)} deleteGroup={() => deleteNewGroup(groupIndex)} submitGroup={() => onSubmitNewGroup(groupIndex)} />
      )}

      <button type="button" className="p-2 font-bold text-cyan-600" onClick={addNewGroup}><PlusIcon /> {t('newGroup')}</button>

    </div>
  );
}

/*
        <div key={groupIndex} className="my-2 p-2 rounded border border-slate-400">
          <div className="flex flex-row">
            <div className="flex-grow">
              {contents.map((content, contentIndex) => <div key={contentIndex}>
                <input type="text" className="my-1 p-2 rounded border border-slate-500 w-full" defaultValue={content} onChange={(event) => updateContentInNewGroup(groupIndex, contentIndex, event.target.value)} />
              </div>)}

              <button type="button" className="p-2 font-bold text-cyan-600" onClick={() => addContentToNewGroup(groupIndex)}><PlusIcon /> {t('newContent')}</button>
            </div>

            <div className="flex flex-col">

              <button type="button" className="p-2 font-bold text-red-600" onClick={() => deleteNewGroup(groupIndex)}><DeleteIcon /> {t('removeGroup')}</button>
              <button type="button" className="p-2 font-bold text-blue-600 disabled:text-slate-600" onClick={() => onSubmitNewGroup(groupIndex)} disabled={contents.length === 0}>
                <UpdateIcon /> {t('submitGroup')}
              </button>
            </div>
          </div>
      </div>*/


export function ExerciseTextBlockManagement(): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto">
      <h1 className="my-4 font-bold text-xl text-center">{t('exerciseTextBlockManagement')}</h1>

      <WithQuery query={useExerciseTextBlockManagementQuery()}>
        {({ exercises }) => <>
          {exercises.map(({ id, title, textBlockGroups }) => <Inner key={id} exerciseId={id} title={title} textBlockGroups={textBlockGroups} />)}
        </>}
      </WithQuery>
    </div>
  );
}
