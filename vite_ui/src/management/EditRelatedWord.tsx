import { ReactElement, useState } from 'react';
import { RelatedWordFragment, useDeleteRelatedWordMutation, useEditRelatedWordMutation, useSubmitRelatedWordMutation } from '../graphql';
import { executeMutation } from '../mutationHelpers';
import { DeleteIcon, UpdateIcon } from '../icons';
import { t } from 'i18next';
import update from 'immutability-helper';
import classNames from 'classnames';

interface IState {
  originalWord: RelatedWordFragment | undefined;
  word: string;
  isPositive: boolean;
}

interface IProps {
  groupId: number;
  initialOriginalWord: RelatedWordFragment | undefined;
  onWordDeleted: () => void;
  onWordSubmitted: (relatedWord: RelatedWordFragment) => void;
}

function prepareState(originalWord: RelatedWordFragment | undefined): IState {
  return originalWord !== undefined
    ? { word: originalWord.word, isPositive: originalWord.isPositive, originalWord }
    : { word: '', isPositive: true, originalWord };
}

export function EditRelatedWord({ groupId, initialOriginalWord, onWordDeleted, onWordSubmitted }: IProps): ReactElement {

  const [{ word, isPositive, originalWord }, setState] = useState<IState>(prepareState(initialOriginalWord));

  const [submit, { loading: submitLoading }] = useSubmitRelatedWordMutation();
  const [edit, { loading: editLoading }] = useEditRelatedWordMutation();
  const [deleteWord, { loading: deleteLoading }] = useDeleteRelatedWordMutation();

  const changed = originalWord === undefined || (word !== originalWord.word || isPositive !== originalWord.isPositive);

  const onSubmit = () => {
    const relatedWordInput = { word, isPositive };

    originalWord !== undefined
      ? executeMutation(
        () => edit({ variables: { groupId, originalWord: originalWord.word, relatedWordInput } }),
        ({ relatedWordsGroup }) => {
          const newOriginalWord = relatedWordsGroup?.relatedWord?.edit;

          if (newOriginalWord) {
            setState((state) => update(state, { originalWord: { $set: newOriginalWord } }));
          }
        }
      )
      : executeMutation(
        () => submit({ variables: { groupId, relatedWordInput } }),
        ({ relatedWordsGroup }) => relatedWordsGroup?.submitRelatedWord && onWordSubmitted(relatedWordsGroup.submitRelatedWord)
      );
  };

  const onDelete = () => originalWord !== undefined
    ? executeMutation(
      () => deleteWord({ variables: { groupId, word: originalWord.word } }),
      ({ relatedWordsGroup }) => relatedWordsGroup?.relatedWord?.delete && onWordDeleted()
    )
    : onWordDeleted();

  return (
    <div className={classNames('rounded border flex', changed ? 'border-amber-600' : 'border-slate-500')}>
      <input type="text" value={word} className="p-2 rounded-l flex-grow" onChange={(event) => setState((state) => update(state, { word: { $set: event.target.value } }))} />

      <button type="button" className="p-2 border-l border-slate-500 bg-white" onClick={() => setState((state) => update(state, { $toggle: ['isPositive'] }))}>
        {isPositive ? t('synonym') : t('antonym')}
      </button>

      <button type="button" className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50" onClick={onSubmit} disabled={!changed || editLoading || submitLoading}>
        <UpdateIcon />
      </button>
      <button type="button" className="px-4 py-2 rounded-r bg-red-600 text-white disabled:opacity-50" onClick={onDelete} disabled={deleteLoading}>
        <DeleteIcon />
      </button>
    </div>
  );
}
