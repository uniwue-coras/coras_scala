import {JSX, useState} from 'react';
import {
  RelatedWordFragment,
  RelatedWordsGroupFragment,
  useCreateEmptyRelatedWordsGroupMutation,
  useDeleteRelatedWordsGroupMutation,
  useManageRelatedWordsQuery
} from '../graphql';
import {WithQuery} from '../WithQuery';
import {useTranslation} from 'react-i18next';
import update, {Spec} from 'immutability-helper';
import {EditedRelatedWordsGroup, EditRelatedWordsGroup} from './EditRelatedWordsGroup';

interface IProps {
  initialRelatedWordsGroups: RelatedWordsGroupFragment[];
}

const prepareGroup = ({groupId, content}: RelatedWordsGroupFragment): EditedRelatedWordsGroup => ({groupId, content, newContent: []});

const emptyNewRelatedWordInput: RelatedWordFragment = {word: '', isPositive: true};

function Inner({initialRelatedWordsGroups}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<EditedRelatedWordsGroup[]>(initialRelatedWordsGroups.map(prepareGroup));

  const [createEmptyRelatedWordsGroup] = useCreateEmptyRelatedWordsGroupMutation();
  const [deleteRelatedWordsGroup] = useDeleteRelatedWordsGroupMutation();

  const onChangeGroup = (groupIndex: number, innerSpec: Spec<EditedRelatedWordsGroup>) => setState(
    (state) => update(state, {[groupIndex]: innerSpec})
  );

  const onDeleteRelatedWordsGroup = (groupIndex: number): Promise<void | undefined> =>
    deleteRelatedWordsGroup({variables: {groupId: state[groupIndex].groupId}})
      .then(({data}) => {
        if (data?.relatedWordsGroup?.delete) {
          setState((state) => update(state, {$splice: [[groupIndex, 1]]}));
        } else {
          console.info(JSON.stringify(data));
        }
      })
      .catch((error) => console.error(error));

  const onAddRelatedWordsGroup = (): Promise<void | undefined> =>
    createEmptyRelatedWordsGroup({variables: {}})
      .then(({data}) => {
        if (data?.createEmptyRelatedWordsGroup) {
          setState((state) => update(state, {$push: [{groupId: data.createEmptyRelatedWordsGroup, content: [], newContent: []}]}));
        }
      })
      .catch((error) => console.error(error));

  const onAddNewRelatedWord = (groupIndex: number) => onChangeGroup(groupIndex, {newContent: {$push: [emptyNewRelatedWordInput]}});

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-center text-2xl">{t('relatedWords')}</h2>

      {state.map((group, groupIndex) =>
        <EditRelatedWordsGroup key={group.groupId}
                               group={group}
                               onAddRelatedWord={() => onAddNewRelatedWord(groupIndex)}
                               onDeleteRelatedWord={(contentIndex) => onChangeGroup(groupIndex, {content: {$splice: [[contentIndex, 1]]}})}
                               onDeleteGroup={() => onDeleteRelatedWordsGroup(groupIndex)}/>)}

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
