import {NounMatchingResultFragment} from '../graphql';

interface IProps {
  result: NounMatchingResultFragment;
}

export function WordMatchingResult({result}: IProps): JSX.Element {

  return (
    <div>
      {result.matches.map(({sampleValue, userValue}, index) =>
        <div key={index}>{sampleValue.word} :: {userValue.word}</div>
      )}
    </div>
  );
}
