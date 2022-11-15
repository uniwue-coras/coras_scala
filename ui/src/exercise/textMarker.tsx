import {NounMatchingResultFragment} from '../graphql';
import {SideSelector} from './NewCorrectSolutionContainer';

interface IProps {
  text: string;
  side: SideSelector;
  backgroundColor: string | undefined;
  nmr: NounMatchingResultFragment;
}

interface TextPart {
  textPart: string;
  isMarked: boolean;
}

export function MarkedText({text, side, backgroundColor, nmr: {matches}}: IProps): JSX.Element {

  const splitText: TextPart[] = text
    .split(/\s+/)
    .map(
      (textPart, index) => ({
        textPart,
        isMarked: matches.some(
          ({sampleValue, userValue}) => side === SideSelector.Sample ? sampleValue.index === index : userValue.index === index
        )
      })
    );

  return (
    <>
      {splitText.map(({textPart, isMarked}, index) =>
        <>
          {isMarked
            ? <span key={index} className="p-2 rounded" style={{backgroundColor}}>{textPart}</span>
            : <span key={index}>{textPart}</span>}
          &nbsp;
        </>
      )}
    </>
  );
}
