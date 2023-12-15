import { Fragment, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface IMatch<T, E> {
  sampleValue: T;
  userValue: T;
  maybeExplanation?: E;
}

interface IMatchingResult<T, E> {
  matches: IMatch<T, E>[];
  notMatchedSample: T[];
  notMatchedUser: T[];
}

interface IProps<T, E> {
  name: string;
  matchingResult: IMatchingResult<T, E>;
  onHover: (matchIndex: number | undefined) => void;
  children: (t: T) => ReactElement;
}

const leftCellClasses = 'px-4 py2 border border-slate-200 text-right';
const centerCellClasses = 'px-4 py2 border border-slate-200 text-center';
const rightCellClasses = 'px-4 py2 border border-slate-200 text-left';

export function MatchingResultDisplay<T, E>({ name, matchingResult, onHover, children }: IProps<T, E>): ReactElement {

  const { t } = useTranslation('common');
  const { matches, notMatchedSample, notMatchedUser } = matchingResult;

  return (
    <div className="my-8 p-4 rounded border border-slate-200">
      <h2 className="mb-4 font-bold text-xl text-center">{name}</h2>

      <table className="table-auto border-collapse border border-slate-200 w-full">
        <colgroup>
          <col className="w-5/12" />
          <col />
          <col className="w-5/12" />
        </colgroup>
        <thead>
          <tr className="font-bold">
            <th className={leftCellClasses}>{t('sampleValue')}</th>
            <th />
            <th className={rightCellClasses}>{t('userValue')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(({ sampleValue, userValue, maybeExplanation }, index) =>
            <tr key={index}>
              <td className={leftCellClasses} onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(undefined)}>{children(sampleValue)}</td>
              <td className={centerCellClasses}>{maybeExplanation ? <>&asymp;</> : <>&hArr;</>}</td>
              <td className={rightCellClasses} onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(undefined)}>{children(userValue)}</td>
            </tr>)}

          {notMatchedSample.map((val, index) => <tr key={matches.length + index}>
            <td className={leftCellClasses} >{children(val)}</td>
            <td className={centerCellClasses} />
            <td className={rightCellClasses} />
          </tr>)}

          {notMatchedUser.map((val, index) => <tr key={matches.length + notMatchedSample.length + index}>
            <td className={leftCellClasses} />
            <td className={centerCellClasses} />
            <td className={rightCellClasses}>{children(val)}</td>
          </tr>)}
        </tbody>
      </table>
    </div >
  );
}
