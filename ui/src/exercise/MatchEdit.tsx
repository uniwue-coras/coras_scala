import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {IFlatSolutionNodeFragment, SolutionNodeMatchFragment} from '../graphql';
import {SideSelector} from './CorrectSolutionView';

export interface MatchEditData {
  markedNodeSide: SideSelector;
  markedNode: IFlatSolutionNodeFragment;
  matches: [SolutionNodeMatchFragment, IFlatSolutionNodeFragment][];
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
}

const deleteButtonClasses = 'p-2 rounded bg-red-600 text-white w-full';

export function MatchEdit({/*markedNodeSide,*/ markedNode: userNode, matches, onDeleteMatch}: MatchEditData): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <section className="px-2">
      {/* <h2 className="font-bold text-center">{t('editMatch')}</h2> */}

      {matches.map(([{sampleValue, userValue}, sampleNode]) =>
        <button type="button" key={sampleValue + '_' + userValue} onClick={() => onDeleteMatch(sampleValue, userValue)} className={deleteButtonClasses}>
          <div>{t('deleteMatch')}:</div>
          <div className="text-left">{t('sampleValue')}: {sampleNode.text.substring(0, 20)}...</div>
          <div className="text-left">{t('userValue')}: {userNode.text.substring(0, 20)}...</div>
        </button>)}

    </section>
  );
}
