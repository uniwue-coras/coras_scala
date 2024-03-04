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
  matchingResult: IMatchingResult<T, E>;
  onHover: (matchIndex: number | undefined) => void;
  children: (t: T) => ReactElement;
}

export function MatchingResultDisplay<T, E>({ matchingResult, onHover, children }: IProps<T, E>): ReactElement {

  const { matches, notMatchedSample, notMatchedUser } = matchingResult;

  return (
    <div className="mb-2 p-2 rounded border border-slate-500">
      <div className="flex flex-row flex-wrap space-x-4">
        {matches.map(({ sampleValue, userValue, maybeExplanation }, index) =>
          <div key={index} className="text-center" onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(undefined)}>
            {children(sampleValue)} {maybeExplanation ? <span>&asymp;</span> : <span>&hArr;</span>} {children(userValue)}
          </div>)}
        {notMatchedSample.map((val, index) => <div key={matches.length + index}>
          {children(val)} &hArr; <span className="text-red-600">&#x2205;</span>
        </div>)}
        {notMatchedUser.map((val, index) => <div key={matches.length + index}>
          <span className="text-red-600">&#x2205;</span> &hArr; {children(val)}
        </div>)}
      </div>
    </div>
  );
}
