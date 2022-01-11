import {useTranslation} from 'react-i18next';
import {TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
import {ComparisonResultTableEntryDisplay} from './TableComparisonEntry';
import {stringifyApplicability} from '../model/applicability';
import {ParagraphCitationMatchResultRows} from './ParagraphCitationMatchResultDisplay';
import {Spec} from 'immutability-helper';

interface IProps {
  entry: TreeMatch;
  updateCorrection: (spec: Spec<TreeMatchingResult>) => void;
}

export function MatchExplanationView({entry, updateCorrection}: IProps): JSX.Element {

  const {paragraphMatch, applicabilityComparison} = entry.analysis;

  const {t} = useTranslation('common');

  return (
    <>
      <table className="table is-fullwidth is-borderless">
        <thead>
          <tr>
            <th>{t('aspect')}</th>
            <th>{t('userValue')}</th>
            <th>{t('sampleValue')}</th>
          </tr>
        </thead>

        <tbody>
          <ComparisonResultTableEntryDisplay name={t('applicability')} comparisonResult={applicabilityComparison} describeValue={stringifyApplicability}/>

          {/*<ComparisonResultTableEntryDisplay name={t('weight')} comparisonResult={weightComparison} describeValue={(num) => num.toString()}/>*/}

          {paragraphMatch && <ParagraphCitationMatchResultRows result={paragraphMatch}/>}

          {/*matchAnalysis.correctionType === 'StringEquals'
          ? <p>{t('matchingWithStringComparison')}</p>
          : <pre>{JSON.stringify(matchAnalysis, null, 2)}</pre>*/}
        </tbody>
      </table>

      <div className="field">
        <label htmlFor="comment" className="label">{t('comment')}:</label>
        <div className="control">
          <textarea name="comment" id="comment" placeholder={t('comment')} className="textarea"/>
        </div>
      </div>
    </>
  );
}
