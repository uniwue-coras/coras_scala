import {ChangeEvent, JSX, useState} from 'react';
import classNames from 'classnames';
import {RelatedWordFragment, useDeleteRelatedWordMutation, useEditRelatedWordMutation, useSubmitRelatedWordMutation} from '../graphql';
import update from 'immutability-helper';
import {executeMutation} from '../mutationHelpers';
import {UpdateIcon} from '../icons';

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
    ? {word: originalWord.word, isPositive: originalWord.isPositive, originalWord}
    : {word: '', isPositive: true, originalWord};
}

export function EditRelatedWord({groupId, initialOriginalWord, onWordDeleted, onWordSubmitted}: IProps): JSX.Element {

  const [{word, isPositive, originalWord}, setState] = useState<IState>(prepareState(initialOriginalWord));
  const [submit, {loading: submitLoading, /* error */}] = useSubmitRelatedWordMutation();
  const [edit, {loading: editLoading/*, error*/}] = useEditRelatedWordMutation();
  const [deleteWord, {loading: deleteLoading /*, error*/}] = useDeleteRelatedWordMutation();

  const changed = originalWord === undefined || (word !== originalWord.word || isPositive !== originalWord.isPositive);

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => setState((state) => update(state, {isPositive: {$set: event.target.value === 'Synonym'}}));
  const onWordChange = (event: ChangeEvent<HTMLInputElement>): void => setState((state) => update(state, {word: {$set: event.target.value}}));

  const onSubmit = async (): Promise<void> => {
    const relatedWordInput = {word, isPositive};

    if (originalWord !== undefined) {
      await executeMutation(
        () => edit({variables: {groupId, originalWord: originalWord.word, relatedWordInput}}),
        ({relatedWordsGroup}) => {
          if (relatedWordsGroup?.relatedWord?.edit) {
            const newOriginalWord = relatedWordsGroup.relatedWord.edit;
            setState((state) => update(state, {originalWord: {$set: newOriginalWord}}));
          }
        }
      );
    } else {
      await executeMutation(
        () => submit({variables: {groupId, relatedWordInput}}),
        ({relatedWordsGroup}) => relatedWordsGroup?.submitRelatedWord && onWordSubmitted(relatedWordsGroup.submitRelatedWord)
      );
    }
  };

  const onDelete = async (): Promise<void> => originalWord !== undefined
    ? await executeMutation(
      () => deleteWord({variables: {groupId, word: originalWord.word}}),
      ({relatedWordsGroup}) => relatedWordsGroup?.relatedWord?.delete && onWordDeleted()
    )
    : onWordDeleted();

  return (
    <div className={classNames('rounded border flex', changed ? 'border-red-600' : 'border-slate-500')}>
      <input type="text" value={word} className="p-2 rounded-l flex-grow" onChange={onWordChange}/>

      <select value={isPositive ? 'Synonym' : 'Antonym'} className="p-2 border-l border-slate-500 bg-white" onChange={onSelectChange}>
        <option value="Antonym">Ant</option>
        <option value="Synonym">Syn</option>
      </select>

      <button type="button" className="p-2 bg-blue-600 text-white disabled:opacity-50" onClick={onSubmit} disabled={!changed || editLoading || submitLoading}>
        <UpdateIcon/>
      </button>
      <button type="button" className="p-2 rounded-r bg-red-600 text-white" onClick={onDelete}
        disabled={deleteLoading}>{/* TODO: delete icon... */}&nbsp;-&nbsp;</button>
    </div>
  );
}
