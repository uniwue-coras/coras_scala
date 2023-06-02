import {ChangeEvent, JSX, useState} from 'react';
import classNames from 'classnames';
import {RelatedWordFragment, useEditRelatedWordMutation} from '../graphql';
import update from 'immutability-helper';

interface IState {
  originalWord: RelatedWordFragment;
  word: string;
  isPositive: boolean;
}

interface IProps {
  groupId: number;
  editedRelatedWord: RelatedWordFragment;
  onDelete: () => void;
}

export function EditRelatedWord({groupId, editedRelatedWord, onDelete}: IProps): JSX.Element {

  const [{word, isPositive, originalWord}, setState] = useState<IState>({originalWord: editedRelatedWord, ...editedRelatedWord});
  const [edit, {data, loading, error}] = useEditRelatedWordMutation();

  const changed = word !== originalWord.word || isPositive !== originalWord.isPositive;

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => setState((state) => update(state, {isPositive: {$set: event.target.value === 'Synonym'}}));
  const onWordChange = (event: ChangeEvent<HTMLInputElement>): void => setState((state) => update(state, {word: {$set: event.target.value}}));

  const onSubmit = (): void => {
    edit({variables: {groupId, originalWord: originalWord.word, newValue: {word, isPositive}}})
      .then(({data}) => console.info(JSON.stringify(data, null, 2)))
      .catch((error) => console.error(error));
  };

  return (
    <div className={classNames('rounded border flex', changed ? 'border-red-600' : 'border-slate-500')}>
      <input type="text" value={word} className="p-2 rounded-l flex-grow" onChange={onWordChange}/>

      <select value={isPositive ? 'Synonym' : 'Antonym'} className="p-2 border-l border-slate-500 bg-white" onChange={onSelectChange}>
        <option value="Antonym">Ant</option>
        <option value="Synonym">Syn</option>
      </select>

      <button type="button" className="p-2 bg-blue-600 text-white disabled:opacity-50" onClick={onSubmit} disabled={!changed || loading}>&#x27F3;</button>
      <button type="button" className="p-2 rounded-r bg-red-600 text-white" onClick={onDelete}>&nbsp;-&nbsp;</button>
    </div>
  );
}
