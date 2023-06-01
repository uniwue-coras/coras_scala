import {JSX, useState} from 'react';
import {
  RelatedWordFragment,
  RelatedWordInput,
  RelatedWordsGroupFragment,
  RelatedWordsGroupInput,
  useCreateEmptyRelatedWordsGroupMutation,
  useDeleteRelatedWordsGroupMutation,
  useManageRelatedWordsQuery
} from '../graphql';
import {WithQuery} from '../WithQuery';
import {useTranslation} from 'react-i18next';
import update, {Spec} from 'immutability-helper';
import {EditedRelatedWordsGroup, EditRelatedWordsGroup} from './EditRelatedWordsGroup';
import {EditedRelatedWord, editedRelatedWordChanged} from './EditRelatedWord';

interface IProps {
  initialRelatedWordsGroups: RelatedWordsGroupFragment[];
}

const prepareWord = ({word, isPositive}: RelatedWordFragment): EditedRelatedWord => ({word, isPositive, originalWord: word, originalIsPositive: isPositive});

const prepareGroup = ({groupId, content}: RelatedWordsGroupFragment): EditedRelatedWordsGroup => ({groupId, content: content.map(prepareWord), newContent: []});

/** @deprecated */
interface IState {
  existingRelatedWordsGroups: EditedRelatedWordsGroup[];
}

const prepareState = (initialRelatedWordsGroups: RelatedWordsGroupFragment[]): IState => ({
  existingRelatedWordsGroups: initialRelatedWordsGroups.map(prepareGroup),
});

const emptyNewRelatedWordInput: RelatedWordInput = {word: '', isPositive: true};

const emptyRelatedWordsGroup: RelatedWordsGroupInput = {
  content: [emptyNewRelatedWordInput]
};

function Inner({initialRelatedWordsGroups}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>(prepareState(initialRelatedWordsGroups));
  const [createEmptyRelatedWordsGroup] = useCreateEmptyRelatedWordsGroupMutation();
  const [deleteRelatedWordsGroup] = useDeleteRelatedWordsGroupMutation();

  const onChangeGroup = (groupIndex: number, innerSpec: Spec<EditedRelatedWordsGroup>) => setState(
    (state) => update(state, {existingRelatedWordsGroups: {[groupIndex]: innerSpec}})
  );

  const onChangeExistingRelatedWord = (groupIndex: number, contentIndex: number, innerSpec: Spec<EditedRelatedWord>) => onChangeGroup(groupIndex, {content: {[contentIndex]: innerSpec}});

  const onDeleteRelatedWordsGroup = (groupId: number, groupIndex: number): Promise<void | undefined> => deleteRelatedWordsGroup({variables: {groupId}})
    .then(({data}) => {
      if (data?.relatedWordsGroup?.delete) {
        setState((state) => update(state, {existingRelatedWordsGroups: {$splice: [[groupIndex, 1]]}}));
      }
    })
    .catch((error) => console.error(error));

  const onAddRelatedWordsGroup = (): void => {
    createEmptyRelatedWordsGroup({variables: {}})
      .then(({data}) => {
        if (data?.createEmptyRelatedWordsGroup) {
          const newGroupId = data.createEmptyRelatedWordsGroup;

          setState((state) => update(state, {existingRelatedWordsGroups: {$push: [{groupId: newGroupId, content: [], newContent: []}]}}));
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-center text-2xl">{t('relatedWords')}</h2>

      {state.existingRelatedWordsGroups.map(({groupId, content}, groupIndex) =>
        <EditRelatedWordsGroup key={groupId}
          content={content}
          checkIfChanged={editedRelatedWordChanged}
          onWordChange={(contentIndex, newWord) => onChangeExistingRelatedWord(groupIndex, contentIndex, {word: {$set: newWord}})}
          onIsPositiveChange={(contentIndex, isPositive) => onChangeExistingRelatedWord(groupIndex, contentIndex, {isPositive: {$set: isPositive}})}
          onAddRelatedWord={() => onChangeGroup(groupIndex, {newContent: {$push: [emptyNewRelatedWordInput]}})}
          onDeleteRelatedWord={(contentIndex) => onChangeGroup(groupIndex, {content: {$splice: [[contentIndex, 1]]}})}
          onDeleteGroup={() => onDeleteRelatedWordsGroup(groupId, groupIndex)}/>)}

      <button type="button" onClick={onAddRelatedWordsGroup} className="my-4 p-2 rounded bg-blue-500 text-white w-full disabled:opacity-50">+</button>
    </div>
  );
}

export function ManageRelatedWords(): JSX.Element {

  const query = useManageRelatedWordsQuery();

  return (
    <WithQuery query={query}>
      {({relatedWordGroups}) => <Inner initialRelatedWordsGroups={relatedWordGroups}/>}
    </WithQuery>

  );
}
