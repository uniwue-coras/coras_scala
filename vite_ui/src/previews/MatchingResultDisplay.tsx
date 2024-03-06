import { ReactElement } from 'react';
import { EmptySetIcon } from '../icons';

interface IMatch<T, E> {
  sampleValue: T;
  userValue: T;
  maybeExplanation?: E;
}

interface IMatchingResult<T, E> {
  matches: IMatch<T, E>[];
  notMatchedSample: T[];
  notMatchedUser: T[];
  certainty: number;
}

interface IProps<T, E> {
  matchingResult: IMatchingResult<T, E>;
  children: (t: T) => ReactElement;
}

export function MatchingResultDisplay<T, E>({ matchingResult, children }: IProps<T, E>): ReactElement {

  const { matches, notMatchedSample, notMatchedUser, certainty } = matchingResult;

  return (
    <div className="mb-2 p-2 rounded border border-slate-500">
      <div className="flex flex-row flex-wrap space-x-4">
        <div className="font-bold">[{Math.ceil(certainty * 100)}%]</div>

        {matches.map(({ sampleValue, userValue, maybeExplanation }, index) =>
          <div key={index} className="text-center">
            {children(sampleValue)} {maybeExplanation ? <span>&asymp;</span> : <span>&hArr;</span>} {children(userValue)}
          </div>)}
        {notMatchedSample.map((val, index) => <div key={matches.length + index}>
          {children(val)} &hArr; <span className="text-red-600"><EmptySetIcon /></span>
        </div>)}
        {notMatchedUser.map((val, index) => <div key={matches.length + index}>
          <span className="text-red-600"><EmptySetIcon /></span> &hArr; {children(val)}
        </div>)}
      </div>
    </div>
  );
}
