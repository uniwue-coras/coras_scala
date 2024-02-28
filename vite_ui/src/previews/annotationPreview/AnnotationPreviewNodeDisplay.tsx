import { Fragment, ReactElement } from 'react';
import { ParagraphCitationLocationFragment, MatchingReviewSolNodeFragment, DefaultSolutionNodeMatchFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { allMatchColors } from '../../allMatchColors';
import { stringifyParagraphCitation } from '../../paragraph';
import { getBullet } from '../../solutionInput/bulletTypes';
import { minimalSolutionNodeMatchesCorrespond } from '../../minimalSolutionNodeMatch';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from '../../exercise/SideSelector';

const indentInPixel = 20;

type M = DefaultSolutionNodeMatchFragment;

export interface AnnotationPreviewSampleNodeDisplayProps {
  isSample: boolean;
  node: MatchingReviewSolNodeFragment;
  matchCurrentlyExamined?: M | undefined;
  ownMatches: M[];
  depth: number;
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

/** @deprecated "is duplicated!" */
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

const dragDropType = 'annotationPreviewDragDrop';

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

export function AnnotationPreviewSampleNodeDisplay({ isSample, depth, node, ownMatches, matchCurrentlyExamined, onDragDrop }: AnnotationPreviewSampleNodeDisplayProps): ReactElement {

  const { id, childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

  const ownMatch = ownMatches.length > 0 ? ownMatches[0] : undefined;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && minimalSolutionNodeMatchesCorrespond(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations);

  const [draggedSide, dragRef] = useDrag<DragItem, unknown, SideSelector | undefined>({
    type: dragDropType,
    item: ({ isSample, nodeId: id }),
    collect: (monitor) => {
      const item = monitor.getItem();

      return item !== null ? (item.isSample ? SideSelector.Sample : SideSelector.User) : undefined;
    }
  });

  const [/*{ canDrop, isOver }*/, dropRef] = useDrop<DragItem, unknown, { canDrop: boolean, isOver: boolean }>({
    accept: dragDropType,
    canDrop: () => draggedSide !== undefined && draggedSide !== (isSample ? SideSelector.Sample : SideSelector.User),
    collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    drop: async ({ nodeId, isSample }) => isSample ? onDragDrop(nodeId, id) : onDragDrop(id, nodeId)
  });

  return (
    <div className={classNames('flex', { 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
      {!isSubText && <div className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef}>
        {getBullet(depth, childIndex)}.
      </div>}
      <div className="mx-2 p-2 flex-grow rounded text-justify" style={{ background, border }}>{displayedText}</div>
      <div className="py-2">{stringifyApplicability(applicability)}</div>
    </div>
  );
}
