import {AllSynonymsQuery, useAllSynonymsQuery} from './graphql';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';

export function SynonymsOverview(): JSX.Element {

  const {t} = useTranslation('common');
  const allSynonymsQuery = useAllSynonymsQuery();

  function render({allSynonyms}: AllSynonymsQuery): JSX.Element {

    const maxSynonymCount = allSynonyms.map((synonyms) => synonyms.length).reduce((a, b) => Math.max(a, b), 0);

    return (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>{t('word')}</th>
            <th colSpan={maxSynonymCount}>{t('synonyms')}</th>
          </tr>
        </thead>
        <tbody>
          {allSynonyms.map((synonyms) => <tr key={synonyms[0]}>
            {synonyms.map((synonym) => <td key={synonym}>{synonym}</td>)}
          </tr>)}
        </tbody>
      </table>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('synonyms')}</h1>

      <WithQuery query={allSynonymsQuery}>{render}</WithQuery>
    </div>
  );

}
