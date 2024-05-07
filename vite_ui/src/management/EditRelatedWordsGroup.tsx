import { ReactElement, useState } from 'react';
import { EditRelatedWord } from './EditRelatedWord';
import { RelatedWordFragment, RelatedWordsGroupFragment, useDeleteRelatedWordsGroupMutation } from '../graphql';
import { executeMutation } from '../mutationHelpers';
import { DeleteIcon, PlusIcon } from '../icons';
import update from 'immutability-helper';

interface IProps {
  group: RelatedWordsGroupFragment;
  onGroupDeleted: () => void;
  onWordDeleted: (contentIndex: number) => void;
  onWordSubmitted: (relatedWord: RelatedWordFragment) => void;
}

export function EditRelatedWordsGroup({ group, onGroupDeleted, onWordDeleted, onWordSubmitted }: IProps): ReactElement {

  const { groupId, content } = group;

  const [state, setState] = useState<undefined[]>([]);
  const [deleteRelatedWordsGroup] = useDeleteRelatedWordsGroupMutation();

  const onDeleteRelatedWordsGroup = () => executeMutation(
    () => deleteRelatedWordsGroup({ variables: { groupId } }),
    ({ relatedWordsGroup }) => relatedWordsGroup?.delete && onGroupDeleted()
  );

  const onAddRelatedWord = () => setState((state) => update(state, { $push: [undefined] }));

  const onNewWordDeleted = (newWordIndex: number) => setState((state) => update(state, { $splice: [[newWordIndex, 1]] }));

  const onNewWordSubmitted = (newWord: RelatedWordFragment, newWordIndex: number) => {
    setState((state) => update(state, { $splice: [[newWordIndex, 1]] }));
    onWordSubmitted(newWord);
  };

  return (
    <div className="my-4 p-2 rounded border border-slate-500 grid grid-cols-3 gap-2">
      {content.map((initialOriginalWord, contentIndex) =>
        <EditRelatedWord key={contentIndex} {...{ groupId, initialOriginalWord }} onWordDeleted={() => onWordDeleted(contentIndex)} onWordSubmitted={() => void 0} />)}

      {state.map((initialOriginalWord, newWordIndex) =>
        <EditRelatedWord key={`new_${newWordIndex}`} {...{ groupId, initialOriginalWord }} onWordDeleted={() => onNewWordDeleted(newWordIndex)}
          onWordSubmitted={(newWord) => onNewWordSubmitted(newWord, newWordIndex)} />)}

      <section className="grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded bg-blue-500 text-white" onClick={onAddRelatedWord}><PlusIcon /></button>
        <button type="button" className="p-2 rounded bg-red-500 text-white" onClick={onDeleteRelatedWordsGroup}><DeleteIcon /></button>
      </section>
    </div>
  );
}
