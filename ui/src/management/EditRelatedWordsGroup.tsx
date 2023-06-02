import {JSX} from 'react';
import {EditRelatedWord} from './EditRelatedWord';
import {RelatedWordFragment} from '../graphql';

export interface EditedRelatedWordsGroup {
  groupId: number;
  content: RelatedWordFragment[];
  newContent: RelatedWordFragment[];
}

interface IProps {
  group: EditedRelatedWordsGroup;
  onDeleteRelatedWord: (contentIndex: number) => void;
  onAddRelatedWord: () => void;
  onDeleteGroup: () => void;
}

export function EditRelatedWordsGroup({group, onAddRelatedWord, onDeleteRelatedWord, onDeleteGroup}: IProps): JSX.Element {

  const {groupId, content, newContent} = group;

  return (
    <div className="my-4 p-2 rounded border border-slate-500 grid grid-cols-3 gap-2">
      {content.map((editedRelatedWord, contentIndex) =>
        <EditRelatedWord key={contentIndex} groupId={groupId} editedRelatedWord={editedRelatedWord} onDelete={() => onDeleteRelatedWord(contentIndex)}/>)}

      {newContent.map((editedRelatedword, contentIndex) =>
        <EditRelatedWord key={`new_${contentIndex}`} groupId={groupId} editedRelatedWord={editedRelatedword} onDelete={() => void 0}/>)}

      <section className="grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded bg-blue-500 text-white w-full" onClick={onAddRelatedWord}>+</button>
        <button type="button" className="p-2 rounded bg-red-500 text-white w-full" onClick={onDeleteGroup}>-</button>
      </section>
    </div>
  );
}
