import {ColoredMatch} from './NewCorrectSolutionContainer';
import {useTranslation} from 'react-i18next';
import {NounMatchingResultFragment} from '../graphql';

interface IProps {
  selectedMatch: ColoredMatch;
  clearMatch: () => void;
}

const enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong',
  Other = '...'
}

const errorTypes: ErrorType[] = [ErrorType.Missing, ErrorType.Wrong, ErrorType.Other];

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
          <button type="button" className="p-2 rounded bg-red-500 text-white font-bold w-full" title={t('clearMatch')} onClick={clearMatch}>X</button>
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
        <input type="text" name="comment" placeholder={t('comment')} className="mt-2 p-2 rounded border border-slate-500 w-full"/>
      </div>

      <div>
        <p>TODO: matching erklärung...</p>

        {explanation && <pre>{JSON.stringify(explanation, null, 2)}</pre>}
      </div>

    </div>
  );
}
