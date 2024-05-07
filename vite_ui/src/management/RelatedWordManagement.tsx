import { ReactElement, useState } from 'react';
import { RelatedWordsGroupFragment, useCreateEmptyRelatedWordsGroupMutation, useManageRelatedWordsQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import { EditRelatedWordsGroup } from './EditRelatedWordsGroup';
import { executeMutation } from '../mutationHelpers';
import { PlusIcon } from '../icons';
import update, { Spec } from 'immutability-helper';

interface IProps {
  initialRelatedWordsGroups: RelatedWordsGroupFragment[];
}

function Inner({ initialRelatedWordsGroups }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [state, setState] = useState<RelatedWordsGroupFragment[]>(initialRelatedWordsGroups);

  const [createEmptyRelatedWordsGroup, { loading }] = useCreateEmptyRelatedWordsGroupMutation();

  const onChangeGroup = (groupIndex: number, innerSpec: Spec<RelatedWordsGroupFragment>) => setState(
    (state) => update(state, { [groupIndex]: innerSpec })
  );

  const onGroupDeleted = (groupIndex: number) => setState((state) => update(state, { $splice: [[groupIndex, 1]] }));

  const onAddRelatedWordsGroup = () => executeMutation(
    () => createEmptyRelatedWordsGroup({ variables: {} }),
    ({ groupId }) => setState((state) => update(state, { $push: [{ groupId, content: [] }] }))
  );

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-center text-2xl">{t('relatedWords')}</h2>

      {state.map((group, groupIndex) =>
        <EditRelatedWordsGroup key={group.groupId} group={group} onGroupDeleted={() => onGroupDeleted(groupIndex)}
          onWordDeleted={(contentIndex) => onChangeGroup(groupIndex, { content: { $splice: [[contentIndex, 1]] } })}
          onWordSubmitted={(newWord) => onChangeGroup(groupIndex, { content: { $push: [newWord] } })} />)}

      <div className="my-4 text-center">
        <button type="button" className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50" onClick={onAddRelatedWordsGroup} disabled={loading}>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

export function RelatedWordManagement(): ReactElement {
  return (
    <WithQuery query={useManageRelatedWordsQuery()}>
      {({ relatedWordGroups }) => <Inner initialRelatedWordsGroups={relatedWordGroups} />}
    </WithQuery>
  );
}
