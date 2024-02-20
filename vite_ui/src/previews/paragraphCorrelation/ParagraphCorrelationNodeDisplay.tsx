import { Fragment, ReactElement } from 'react';
import { ParagraphCorrelationCitationLocationFragment, ParagraphCorrelationFragment, ParagraphCorrelationSolNodeFragment, ParagraphIdentifierFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { stringifyParagraphCitation, paragraphIdentifiersEqual, stringifyParagraphIdentifier } from '../../paragraph';
import { getBullet } from '../../solutionInput/bulletTypes';
import { allMatchColors } from '../../allMatchColors';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  node: ParagraphCorrelationSolNodeFragment;
  depth: number;
  paragraphCorrelations: ParagraphCorrelationFragment[];
  onClick: (parId: ParagraphIdentifierFragment) => void;
}

function underlineParagraphCitationLocationsInText(
  text: string,
  paragraphCitationLocations: ParagraphCorrelationCitationLocationFragment[],
  paragraphCorrelations: ParagraphCorrelationFragment[],
  onClick: (parId: ParagraphIdentifierFragment) => void
): ReactElement {

  // TODO: make recursive, no keys needed!
  const [result, lastRemainingText] = paragraphCitationLocations
    // make sure paragraph citation locations are sorted!
    .toSorted((pl1, pll2) => pl1.from - pll2.from)
    .reduce<[(string | ReactElement)[], string, number]>(
      ([acc, remainingText, currentOffset], { from, to, citedParagraphs }, index) => {

        const allIdentifiers = citedParagraphs.map(({ identifier }) => identifier);
        const allCorrelationIndexes: number[] = allIdentifiers
          .map((identifier) =>
            paragraphCorrelations.findIndex(({ paragraph }) => paragraphIdentifiersEqual(paragraph, identifier))
          )
          .filter((identifier) => identifier >= 0);

        if (allCorrelationIndexes.length > 1) {
          console.info(allCorrelationIndexes);
        }

        const mainIdentifierIndex = paragraphCorrelations.findIndex(({ paragraph }) => paragraphIdentifiersEqual(paragraph, citedParagraphs[0].identifier));
        const background = mainIdentifierIndex >= 0 ? allMatchColors[mainIdentifierIndex] : undefined;

        const priorText = remainingText.substring(0, from - currentOffset - 1);
        const underlinedText = (
          <Fragment key={index}>
            &nbsp;
            <span className="rounded underline" style={{ background }} onClick={() => onClick(allIdentifiers[0])} title={citedParagraphs.map((cp) => stringifyParagraphCitation(cp) + ' (' + stringifyParagraphIdentifier(cp.identifier) + ')').join('\n')}>
              {remainingText.substring(from - currentOffset - 1, to - currentOffset)}
            </span>
            &nbsp;
          </Fragment>
        );
        const newRemainingText = remainingText.substring(to - currentOffset);

        return [[...acc, priorText, underlinedText], newRemainingText, currentOffset + to];
      },
      [[], text, 0]
    );

  return <>{result} {lastRemainingText}</>;
}

export function ParagraphCorrelationNodeDisplay({ depth, node, paragraphCorrelations, onClick }: IProps): ReactElement {

  const { childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations, paragraphCorrelations, onClick);

  return (
    <div className={classNames('flex', { 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
      {!isSubText && <div className="p-2 rounded border border-slate-500"  /* onClick={onClick}*/>
        {getBullet(depth, childIndex)}.
      </div>}
      <div className="mx-2 p-2 flex-grow rounded text-justify">{displayedText}</div>
      <div>{stringifyApplicability(applicability)}</div>
    </div>
  );
}
