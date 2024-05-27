import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExerciseTextBlockFragment, ExerciseTextBlockInput, useDeleteExerciseTextBlockMutation, useExerciseTextBlockManagementQuery, useSubmitExerciseTextBlockMutation, useUpdateExerciseTextBlockMutation } from '../graphql';
import { WithQuery } from '../WithQuery';
import { PlusIcon } from '../icons';
import { executeMutation } from '../mutationHelpers';
import { isDefined } from '../funcs';
import { ExerciseTextBlockForm } from './ExerciseTextBlockGroupForm';
import update, { Spec } from 'immutability-helper';


interface IProps {
  exerciseId: number;
  title: string;
  textBlocks: ExerciseTextBlockFragment[];
}

interface IState {
  textBlocks: (ExerciseTextBlockFragment & { changed?: boolean })[];
  newBlocks: ExerciseTextBlockInput[];
}

function Inner({ exerciseId, title, textBlocks: initialTextBlocks }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [{ textBlocks, newBlocks }, setState] = useState<IState>({ textBlocks: initialTextBlocks, newBlocks: [] });
  const [submitNewBlock] = useSubmitExerciseTextBlockMutation();
  const [deleteBlock] = useDeleteExerciseTextBlockMutation();
  const [updateBlock] = useUpdateExerciseTextBlockMutation();

  // new blocks

  const updateNewBlock = (blockIndex: number, spec: Spec<ExerciseTextBlockInput>) => setState((state) => update(state, { newBlocks: { [blockIndex]: spec } }));

  const addNewBlock = () => setState((state) => update(state, { newBlocks: { $push: [{ startText: '', ends: [] }] } }));
  const deleteNewBlock = (blockIndex: number) => setState((state) => update(state, { newBlocks: { $splice: [[blockIndex, 1]] } }));

  const updateNewBlockStartText = (blockIndex: number) => (newText: string) => updateNewBlock(blockIndex, { startText: { $set: newText } });
  const addEndToNewBlock = (blockIndex: number) => () => updateNewBlock(blockIndex, { ends: { $push: [''] } });
  const updateEndInNewBlock = (blockIndex: number) => (endIndex: number, text: string) => updateNewBlock(blockIndex, { ends: { [endIndex]: { $set: text } } });
  const deleteEndInNewBlock = (blockIndex: number) => (endIndex: number) => updateNewBlock(blockIndex, { ends: { $splice: [[endIndex, 1]] } });

  const onSubmitNewBlock = (blockIndex: number) => executeMutation(
    () => submitNewBlock({ variables: { exerciseId, textBlock: newBlocks[blockIndex] } }),
    ({ exerciseMutations }) => {
      const newGroup = exerciseMutations?.submitTextBlock;
      isDefined(newGroup) && setState((state) => update(state, { textBlocks: { $push: [newGroup] }, newBlocks: { $splice: [[blockIndex, 1]] } }));
    }
  );

  // existing blocks

  const updateExistingBlock = (blockIndex: number, spec: Spec<ExerciseTextBlockFragment & { changed?: boolean }>) => setState((state) => update(state, { textBlocks: { [blockIndex]: spec } }));

  const updateBlockStartText = (blockIndex: number, newText: string) => updateExistingBlock(blockIndex, { startText: { $set: newText }, changed: { $set: true } });
  const updateEndInBlock = (blockIndex: number, endIndex: number, newContent: string) => updateExistingBlock(blockIndex, { ends: { [endIndex]: { $set: newContent } }, changed: { $set: true } });
  const addEndToGroup = (blockIndex: number) => updateExistingBlock(blockIndex, { ends: { $push: [''] }, changed: { $set: true } });
  const deleteEndInBlock = (blockIndex: number, endIndex: number) => updateExistingBlock(blockIndex, { ends: { $splice: [[endIndex, 1]] } });


  const onSubmitBlock = (blockIndex: number) => {
    const { id, startText, ends } = textBlocks[blockIndex];

    executeMutation(
      () => updateBlock({ variables: { exerciseId, blockId: id, textBlock: { startText, ends } } }),
      ({ exerciseMutations }) => {
        const updatedGroup = exerciseMutations?.textBlock?.update;
        isDefined(updatedGroup) && setState((state) => update(state, { textBlocks: { [blockIndex]: { $set: updatedGroup } } }));
      }
    );
  };

  const onDeleteBlock = (blockIndex: number) => !!confirm(t('reallyDeleteGroup')) && executeMutation(
    () => deleteBlock({ variables: { exerciseId, blockId: textBlocks[blockIndex].id } }),
    ({ exerciseMutations }) => {
      isDefined(exerciseMutations?.textBlock?.delete) && setState((state) => update(state, { textBlocks: { $splice: [[blockIndex, 1]] } }));
    }
  );

  return (
    <div className="my-4">
      <h2 className="mt-2 font-bold">{t('exercise')} &quot;{title}&quot;</h2>

      <div>
        {textBlocks.map((textBlock, blockIndex) =>
          <ExerciseTextBlockForm key={textBlock.id} textBlock={textBlock} changed={!!textBlock.changed} updateStartText={(newText) => updateBlockStartText(blockIndex, newText)}
            addEnd={() => addEndToGroup(blockIndex)} updateEnd={(endIndex, newEnd) => updateEndInBlock(blockIndex, endIndex, newEnd)}
            deleteEnd={(endIndex) => deleteEndInBlock(blockIndex, endIndex)} deleteBlock={() => onDeleteBlock(blockIndex)} submitBlock={() => onSubmitBlock(blockIndex)} />)}
      </div>

      <div>
        {newBlocks.map((textBlock, blockIndex) =>
          <ExerciseTextBlockForm key={blockIndex} changed={true} textBlock={textBlock} updateStartText={updateNewBlockStartText(blockIndex)}
            addEnd={addEndToNewBlock(blockIndex)} updateEnd={updateEndInNewBlock(blockIndex)} deleteEnd={deleteEndInNewBlock(blockIndex)}
            deleteBlock={() => deleteNewBlock(blockIndex)} submitBlock={() => onSubmitNewBlock(blockIndex)} />
        )}
      </div>

      <button type="button" className="p-2 font-bold text-cyan-600" onClick={addNewBlock}><PlusIcon /> {t('newBlock')}</button>
    </div>
  );
}


export function ExerciseTextBlockManagement(): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto">
      <h1 className="my-4 font-bold text-xl text-center">{t('exerciseTextBlockManagement')}</h1>

      <WithQuery query={useExerciseTextBlockManagementQuery()}>
        {({ exercises }) => <>
          {exercises.map(({ id, title, textBlocks }) => <Inner key={id} exerciseId={id} title={title} textBlocks={textBlocks} />)}
        </>}
      </WithQuery>
    </div>
  );
}
