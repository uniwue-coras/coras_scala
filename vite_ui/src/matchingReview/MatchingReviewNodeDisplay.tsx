import { Fragment, ReactElement } from 'react';
import { CurrentMatchFragment, ParagraphCitationLocationFragment, RevSolNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { stringifyApplicability } from '../model/applicability';
import { allMatchColors } from '../allMatchColors';
import { stringifyParagraphCitation } from './paragraphCitation';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  isSample: boolean;
  matchCurrentlyExamined: CurrentMatchFragment | undefined;
  onNodeClick: (isSample: boolean, nodeId: number) => void;

  depth: number;
  node: RevSolNodeFragment;
  ownMatch: CurrentMatchFragment | undefined;
}

function underlineParagraphCitationLocationsInText(text: string, paragraphCitationLocations: ParagraphCitationLocationFragment[]): ReactElement {

  // make sure paragraph citation locations are sorted!
  paragraphCitationLocations.sort((pl1, pll2) => pl1.from - pll2.from);

  const [result, lastRemainingText] = paragraphCitationLocations
    .reduce<[(string | ReactElement)[], string, number]>(
      ([acc, remainingText, currentOffset], { from, to, citedParagraphs }, index) => {

        const title = citedParagraphs.map(stringifyParagraphCitation).join('\n');

        const priorText = remainingText.substring(0, from - currentOffset - 1);
        const underlinedText = <Fragment key={index}> <span className="underline" title={title}>{remainingText.substring(from - currentOffset - 1, to - currentOffset)}</span> </Fragment>;
        const newRemainingText = remainingText.substring(to - currentOffset);

        return [[...acc, priorText, underlinedText], newRemainingText, currentOffset + to];
      },
      [[], text, 0]
    );

  return <>{result} {lastRemainingText}</>;
}

function matchesEqual(m1: CurrentMatchFragment, m2: CurrentMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}

export function MatchingReviewNodeDisplay({ isSample, depth, node, ownMatch, matchCurrentlyExamined, onNodeClick }: IProps): ReactElement {

  const { id, childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && matchesEqual(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations);

  return (
    <div className={classNames({ 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }} onClick={() => onNodeClick(isSample, id)}>
      {isSubText ? '' : getBullet(depth, childIndex) + '.'}
      <div className="mx-2 px-2 py-1 inline-block rounded text-justify" style={{ background, border }}>{displayedText}</div>
      {stringifyApplicability(applicability)}
    </div>
  );
}
