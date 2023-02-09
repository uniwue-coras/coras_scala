import {ColoredMatch} from './CorrectSolutionView';
import {useTranslation} from 'react-i18next';
import {NounMatchingResultFragment} from '../graphql';
import {WordMatchingResult} from './WordMatchingResult';

interface IProps {
  selectedMatch: ColoredMatch;
  clearMatch: () => void;
}

export const enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export const errorTypes: ErrorType[] = [ErrorType.Missing, ErrorType.Wrong];

export function CorrectionColumn({selectedMatch, clearMatch}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  // console.info(JSON.stringify(selectedMatch));

  const explanation: NounMatchingResultFragment | undefined | null = selectedMatch.explanation;

  return (
    <div>
      {/* FIXME: ... */}

      <div className="my-4">
        <label htmlFor="matchType" className="font-bold"></label>
        <div className="mt-2">
          <button type="button" className="p-2 rounded bg-red-500 text-white font-bold w-full" title={t('clearMatch') || undefined} onClick={clearMatch}>X
          </button>
        </div>
      </div>

      <div className="my-4">
        <label className="font-bold">{t('errorType')}:</label>
        <div className="mt-2">
          {errorTypes.map((et) => <button type="button" key={et} className="mr-2 p-2 rounded border border-slate-500">{et}</button>)}
        </div>
      </div>

      <div className="my-4">
        <label htmlFor="comment" className="font-bold">{t('comment')}:</label>
        <input type="text" name="comment" placeholder={t('comment') || undefined} className="mt-2 p-2 rounded border border-slate-500 w-full"/>
      </div>


      <div className="mt-4">
        {explanation && <WordMatchingResult result={explanation}/>}
      </div>

    </div>
  );
}
