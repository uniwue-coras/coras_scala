import {JSX, useState} from 'react';
import {AbbreviationFragment, useAbbreviationManagementQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {useTranslation} from 'react-i18next';
import {EditAbbreviation} from './EditAbbreviation';
import update from 'immutability-helper';

interface IProps {
  initialAbbreviations: AbbreviationFragment[];
}

interface IState {
  abbreviations: AbbreviationFragment[];
  newAbbreviations: undefined[];
}

function Inner({initialAbbreviations}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [{abbreviations, newAbbreviations}, setState] = useState<IState>({abbreviations: initialAbbreviations, newAbbreviations: []});

  const onAddAbbreviation = (): void => setState((state) => update(state, {newAbbreviations: {$push: [undefined]}}));

  const onAbbreviationChanged = (index: number, newAbbreviation: AbbreviationFragment): void => setState((state) => update(state, {
    abbreviations: {[index]: {$set: newAbbreviation}}
  }));

  const onAbbreviationCreated = (index: number, newAbbreviation: AbbreviationFragment): void => setState((state) => update(state, {
    abbreviations: {$push: [newAbbreviation]},
    newAbbreviations: {$splice: [[index, 1]]}
  }));

  const onAbbreviationDeleted = (index: number): void => setState((state) => update(state, {abbreviations: {$splice: [[index, 1]]}}));

  const onNewAbbreviationDeleted = (index: number): void => setState((state) => update(state, {newAbbreviations: {$splice: [[index, 1]]}}));

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-center text-2xl">{t('abbreviations')}</h1>

      <table className="table-auto w-full border-collapse text-center">
        <thead>
          <tr>
            <th>{t('abbreviation')}</th>
            <th>{t('word')}</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {abbreviations.map((abbreviation, index) => <EditAbbreviation key={index} initialAbbreviation={abbreviation}
            onChanged={(newAbbreviation) => onAbbreviationChanged(index, newAbbreviation)}
            onDeleted={() => onAbbreviationDeleted(index)}/>)}

          {newAbbreviations.map((newAbbreviation, index) => <EditAbbreviation key={`new_${index}`} initialAbbreviation={newAbbreviation}
            onChanged={(newAbbreviation) => onAbbreviationCreated(index, newAbbreviation)}
            onDeleted={() => onNewAbbreviationDeleted(index)}/>)}

          <tr>
            <td colSpan={3}>
              <button type="button" className="p-2 rounded bg-blue-500 text-white w-full" onClick={onAddAbbreviation}>+ {/* TODO: plus icon?*/}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function AbbreviationManagement(): JSX.Element {

  const query = useAbbreviationManagementQuery();

  return <WithQuery query={query}>
    {({abbreviations}) => <Inner initialAbbreviations={abbreviations}/>}
  </WithQuery>;
}
