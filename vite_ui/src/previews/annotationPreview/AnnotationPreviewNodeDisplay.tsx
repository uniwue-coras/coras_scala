import { ReactElement } from 'react';
import { MatchingReviewSolNodeFragment, DefaultSolutionNodeMatchFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { allMatchColors } from '../../allMatchColors';
import { getBullet } from '../../solutionInput/bulletTypes';
import { minimalSolutionNodeMatchesCorrespond } from '../../minimalSolutionNodeMatch';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from '../../exercise/SideSelector';
import { TextWithUnderlinedParagraphCitations } from '../TextWithUnderlinedParagraphCitations';
import classNames from 'classnames';
import { BasicNodeDisplayProps } from '../../RecursiveSolutionNodeDisplay';

const indentInPixel = 20;

type M = DefaultSolutionNodeMatchFragment;

export interface AnnotationPreviewNodeDisplayProps extends BasicNodeDisplayProps<MatchingReviewSolNodeFragment> {
  isSample: boolean;
  matchCurrentlyExamined?: M | undefined;
  ownMatches: M[];
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

const dragDropType = 'annotationPreviewDragDrop';

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

export function AnnotationPreviewNodeDisplay({ isSample, index, depth, node, ownMatches, matchCurrentlyExamined, onDragDrop }: AnnotationPreviewNodeDisplayProps): ReactElement {

  const { id, text, isSubText, applicability, paragraphCitationLocations } = node;

  const ownMatch = ownMatches.length > 0 ? ownMatches[0] : undefined;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && minimalSolutionNodeMatchesCorrespond(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : <TextWithUnderlinedParagraphCitations text={text} paragraphCitationLocations={paragraphCitationLocations} />;

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
    <div className={classNames('flex items-start', { 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
      {!isSubText && <div className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef}>
        {getBullet(depth, index)}.
      </div>}
      <div className="mx-2 p-2 flex-grow rounded text-justify" style={{ background, border }}>{displayedText}</div>
      <div className="py-2">{stringifyApplicability(applicability)}</div>
    </div>
  );
}
