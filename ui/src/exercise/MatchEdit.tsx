import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {IFlatSolutionNodeFragment} from '../graphql';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';

export interface MatchEditData {
  markedNodeSide: SideSelector;
  markedNode: IFlatSolutionNodeFragment;
  matches: ColoredMatch[];
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
}

export function MatchEdit({markedNodeSide, markedNode, matches, onDeleteMatch}: MatchEditData): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <section className="px-2">
      <h2 className="font-bold text-center">{t('editMatch')}</h2>

      {matches.map(({sampleValue, userValue}) =>
        <button type="button" key={sampleValue + '_' + userValue} onClick={() => onDeleteMatch(sampleValue, userValue)}
          className="p-2 rounded bg-red-600 text-white w-full">
          {t('delete')}: {sampleValue} - {userValue}
        </button>)}

    </section>
  );
}
