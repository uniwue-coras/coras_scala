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

  const { matches/*, notMatchedSample, notMatchedUser*/ } = matchingResult;

  return (
    <div>
      {matches.map(({ sampleValue, userValue, maybeExplanation }, index) =>
        <div key={index} className="px-4 inline-block" onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(undefined)}>
          {children(sampleValue)}
          &nbsp;
          <span className="font-bold">{maybeExplanation ? <>&asymp;</> : <>&hArr;</>}</span>
          &nbsp;
          {children(userValue)}
        </div>)}
    </div>
  );
}
