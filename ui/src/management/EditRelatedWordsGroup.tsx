import {JSX} from 'react';
import {EditedRelatedWord, EditRelatedWord} from './EditRelatedWord';
import {RelatedWordInput} from '../graphql';

export interface EditedRelatedWordsGroup {
  groupId: number;
  content: EditedRelatedWord[];
  newContent: RelatedWordInput[];
}

interface IProps<E extends RelatedWordInput> {
  content: E[];
  checkIfChanged: (e: E) => boolean;
  onWordChange: (contentIndex: number, newWord: string) => void;
  onIsPositiveChange: (contentIndex: number, isPositive: boolean) => void;
  onAddRelatedWord: () => void;
  onDeleteRelatedWord: (contentIndex: number) => void;
  onDeleteGroup: () => void;
}

export function EditRelatedWordsGroup<E extends RelatedWordInput>({
  content,
  checkIfChanged,
  onWordChange,
  onIsPositiveChange,
  onAddRelatedWord,
  onDeleteRelatedWord,
  onDeleteGroup
}: IProps<E>): JSX.Element {

  return (
    <div className="my-4 p-2 rounded border border-slate-500 grid grid-cols-3 gap-2">
      {content.map((editedRelatedWord, contentIndex) =>
        <EditRelatedWord
          key={contentIndex}
          checkIfChanged={checkIfChanged}
          editedRelatedWord={editedRelatedWord}
          onWordChange={(newWord) => onWordChange(contentIndex, newWord)}
          onIsPositiveChange={(isPositive) => onIsPositiveChange(contentIndex, isPositive)}
          onDelete={() => onDeleteRelatedWord(contentIndex)}/>)}

      <section className="grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded bg-blue-500 text-white w-full" onClick={onAddRelatedWord}>+</button>
        <button type="button" className="p-2 rounded bg-red-500 text-white w-full" onClick={onDeleteGroup}>-</button>
      </section>
    </div>
  );
}
