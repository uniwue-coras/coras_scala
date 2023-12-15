import { ReactElement } from 'react';

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

export function MatchingResultDisplay<T, E>({ name, matchingResult, onHover, children }: IProps<T, E>): ReactElement {

  const { matches, notMatchedSample, notMatchedUser } = matchingResult;

  return (
    <div className="my-8 p-8 rounded border border-slate-200">
      <h2 className="my-4 font-bold text-xl text-center">{name}</h2>

      {matches.map(({ sampleValue, userValue, maybeExplanation }, index) =>
        <div key={index} className="text-center" onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(undefined)}>
          {children(sampleValue)}
          &nbsp;
          <span className="font-bold">{maybeExplanation ? <>&asymp;</> : <>&hArr;</>}</span>
          &nbsp;
          {children(userValue)}
        </div>)}

      <div className="grid grid-cols-2 gap-2">
        <div>{notMatchedSample.map((val) => children(val))}</div>
        <div>{notMatchedUser.map((val) => children(val))}</div>
      </div>
    </div>
  );
}
