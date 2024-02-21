import { Fragment, ReactElement } from 'react';
import { ParagraphCitationLocationFragment, MatchingReviewSolNodeFragment, GeneratedAnnotationFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { allMatchColors } from '../../allMatchColors';
import { stringifyParagraphCitation } from '../../paragraph';
import { getBullet } from '../../solutionInput/bulletTypes';
import { MinimalSolutionNodeMatch, minimalSolutionNodeMatchesCorrespond } from '../../solutionNodeMatch';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  node: MatchingReviewSolNodeFragment;
  matchCurrentlyExamined: MinimalSolutionNodeMatch | undefined;
  ownMatch: MinimalSolutionNodeMatch | undefined;
  ownAnnotations: GeneratedAnnotationFragment[];
  depth: number;
}

function underlineParagraphCitationLocationsInText(text: string, paragraphCitationLocations: ParagraphCitationLocationFragment[]): ReactElement {

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

export function AnnotationPreviewNodeDisplay({ depth, node, ownMatch, ownAnnotations, matchCurrentlyExamined }: IProps): ReactElement {

  const { childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && minimalSolutionNodeMatchesCorrespond(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations);


  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={classNames('flex', { 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
        {!isSubText && <div className="p-2 rounded border border-slate-500">
          {getBullet(depth, childIndex)}.
        </div>}
        <div className="mx-2 p-2 flex-grow rounded text-justify" style={{ background, border }}>{displayedText}</div>
        <div>{stringifyApplicability(applicability)}</div>
      </div>

      <div>{ownAnnotations.length > 0 && ownAnnotations.map(({ id, text }) => <div key={id}>{text}</div>)}</div>
    </div>

  );
}
