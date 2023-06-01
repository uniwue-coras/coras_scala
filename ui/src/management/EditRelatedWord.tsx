import {ChangeEvent, JSX, useState} from 'react';
import classNames from 'classnames';
import {RelatedWordInput} from '../graphql';

export interface EditedRelatedWord extends RelatedWordInput {
  originalWord: string;
  originalIsPositive: boolean;
}

export const editedRelatedWordChanged = ({word, originalWord, isPositive, originalIsPositive}: EditedRelatedWord): boolean =>
  word !== originalWord || isPositive !== originalIsPositive;

interface IState {
  word: string;
  isPositive: boolean;
  originalWord: string;
  originalIsPositive: boolean;
}

interface IProps<E extends RelatedWordInput> {
  editedRelatedWord: E;
  checkIfChanged: (e: E) => boolean;
  onWordChange: (newWord: string) => void;
  onIsPositiveChange: (isPositive: boolean) => void;
  onDelete: () => void;
}

export function EditRelatedWord<E extends RelatedWordInput>({
  editedRelatedWord,
  checkIfChanged,
  onWordChange,
  onIsPositiveChange,
  onDelete
}: IProps<E>): JSX.Element {

  const {word, isPositive} = editedRelatedWord;

  const [state, setState] = useState<IState>({word, isPositive, originalWord: word, originalIsPositive: isPositive});

  const changed = checkIfChanged(editedRelatedWord);

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => onIsPositiveChange(event.target.value === 'Synonym');

  return (
    <div className={classNames('rounded border flex', changed ? 'border-red-600' : 'border-slate-500')}>
      <input type="text" value={word} className="p-2 rounded-l flex-grow" onChange={(event) => onWordChange(event.target.value)}/>

      <select value={isPositive ? 'Synonym' : 'Antonym'} className="p-2 border-l border-slate-500 bg-white" onChange={onSelectChange}>
        <option value="Antonym">Ant</option>
        <option value="Synonym">Syn</option>
      </select>

      <button type="button" className="p-2 rounded-r bg-red-600 text-white" onClick={onDelete}>&nbsp;-&nbsp;</button>
    </div>
  );
}
