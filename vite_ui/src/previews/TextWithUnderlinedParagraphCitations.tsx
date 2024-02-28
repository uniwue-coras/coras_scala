import { Fragment, ReactElement } from 'react';
import { ParagraphCitationLocationFragment } from '../graphql';
import { stringifyParagraphCitation } from '../paragraph';

interface IProps {
  text: string;
  paragraphCitationLocations: ParagraphCitationLocationFragment[];
}

/**
 * TODO: make recursive!
 */
export function TextWithUnderlinedParagraphCitations({ text, paragraphCitationLocations }: IProps): ReactElement {
  // make sure paragraph citation locations are sorted!
  paragraphCitationLocations.sort((pl1, pll2) => pl1.from - pll2.from);

  const [result, lastRemainingText] = paragraphCitationLocations
    .reduce<[(string | ReactElement)[], string, number]>(
      ([acc, remainingText, currentOffset], { from, to, citedParagraphs }, index) => {

        const title = citedParagraphs.map(stringifyParagraphCitation).join('\n');

        const priorText = remainingText.substring(0, from - currentOffset - 1);
        const underlinedText = (
          <Fragment key={index}>
            &nbsp;<span className="underline" title={title}>{remainingText.substring(from - currentOffset - 1, to - currentOffset)}</span>&nbsp;
          </Fragment>
        );
        const newRemainingText = remainingText.substring(to - currentOffset);

        return [[...acc, priorText, underlinedText], newRemainingText, currentOffset + to];
      },
      [[], text, 0]
    );

  return <>{result} {lastRemainingText}</>;
}
