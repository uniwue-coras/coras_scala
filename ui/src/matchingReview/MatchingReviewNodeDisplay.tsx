import { Fragment, ReactElement } from 'react';
import { ParagraphCitationLocationFragment, ParagraphCitationFragment, SolutionNodeFragment, ISolutionNodeMatchFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { stringifyApplicability } from '../model/applicability';
import { allMatchColors } from '../allMatchColors';
import classNames from 'classnames';

interface IProps {
  isSample: boolean;
  matchCurrentlyExamined: ISolutionNodeMatchFragment | undefined;
  onNodeClick: (isSample: boolean, nodeId: number) => void;

  depth: number;
  node: SolutionNodeFragment;
  ownMatch: ISolutionNodeMatchFragment | undefined;
}

export function stringifyParagraphCitation({ paragraphType, paragraphNumber, section, rest, lawCode }: ParagraphCitationFragment): string {
  return `${paragraphType} ${paragraphNumber} ${section ? 'Abs. ' + section : ''} ${rest} ${lawCode}`;
}

function underlineParagraphCitationLocationsInText(text: string, paragraphCitationLocations: ParagraphCitationLocationFragment[]): ReactElement {

  const [result, lastRemainingText] = paragraphCitationLocations
    .toSorted((pl1, pl2) => pl1.from - pl2.from)
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

export function matchesEqual(m1: ISolutionNodeMatchFragment, m2: ISolutionNodeMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}

export function MatchingReviewNodeDisplay({ isSample, depth, node, ownMatch, matchCurrentlyExamined, onNodeClick }: IProps): ReactElement {

  const { id, childIndex, text, applicability, paragraphCitationLocations } = node;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && matchesEqual(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations);

  // FIXME: display subTexts!

  return (
    <div className={classNames({ 'font-bold': !false })} onClick={() => onNodeClick(isSample, id)}>
      {getBullet(depth, childIndex)}.
      <div className="mx-2 px-2 py-1 inline-block rounded text-justify" style={{ background, border }}>{displayedText}</div>
      {stringifyApplicability(applicability)}
    </div>
  );
}
