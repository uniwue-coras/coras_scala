import { ReactElement } from 'react';
import { MatchingReviewSolNodeFragment, DefaultSolutionNodeMatchFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { allMatchColors, subTextMatchColor } from '../../allMatchColors';
import { getBullet } from '../../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from '../../exercise/SideSelector';
import { TextWithUnderlinedParagraphCitations } from '../TextWithUnderlinedParagraphCitations';
import { BasicNodeDisplayProps } from '../../RecursiveSolutionNodeDisplay';
import classNames from 'classnames';

const indentInPixel = 20;

type M = DefaultSolutionNodeMatchFragment;

export interface AnnotationPreviewNodeDisplayProps extends BasicNodeDisplayProps<MatchingReviewSolNodeFragment> {
  isSample: boolean;
  ownMatches: M[];
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

const dragDropType = 'annotationPreviewDragDrop';

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

function getBackground(isSubtext: boolean, ownMatches: M[]): [string | undefined, string | undefined] {
  if (ownMatches.length === 0) {
    return [undefined, undefined];
  } else if (ownMatches.length === 1) {
    return [isSubtext
      ? subTextMatchColor
      : allMatchColors[ownMatches[0].sampleNodeId], undefined];
  } else {

    const percentage = 1 / ownMatches.length * 100;

    const colors = ownMatches.map(({ sampleNodeId }, index) => {
      const color = allMatchColors[sampleNodeId];
      return `${color} ${(index) * percentage}%, ${color} ${(index + 1) * percentage}%`;
    });

    return [undefined, `linear-gradient(to right, ${colors.join(', ')})`];
  }
}

export function AnnotationPreviewNodeDisplay({ isSample, index, depth, node, ownMatches, onDragDrop }: AnnotationPreviewNodeDisplayProps): ReactElement {

  const { id, text, isSubText, applicability, paragraphCitationLocations } = node;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : <TextWithUnderlinedParagraphCitations text={text} paragraphCitationLocations={paragraphCitationLocations} />;

  const isDefinition = isSubText && text.trim().startsWith('D:');

  const [draggedSide, dragRef] = useDrag<DragItem, unknown, SideSelector | undefined>({
    type: dragDropType,
    item: ({ isSample, nodeId: id }),
    collect: (monitor) => {
      const item = monitor.getItem();

      return item !== null ? (item.isSample ? SideSelector.Sample : SideSelector.User) : undefined;
    }
  });

  const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, unknown, { canDrop: boolean, isOver: boolean }>({
    accept: dragDropType,
    canDrop: () => draggedSide !== undefined && draggedSide !== (isSample ? SideSelector.Sample : SideSelector.User),
    collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    drop: async ({ nodeId, isSample }) => isSample ? onDragDrop(nodeId, id) : onDragDrop(id, nodeId)
  });

  const [backgroundColor, backgroundImage] = getBackground(isSubText, ownMatches);

  return (
    <div className={classNames('flex items-start', { 'font-bold': !isSubText, 'bg-slate-300': canDrop && isOver })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
      <div className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef}>
        {isSubText
          ? <span className="italic">{isDefinition ? 'D' : 'S'}</span>
          : <>{getBullet(depth, index)}.</>}
      </div>
      <div className="mx-2 p-2 flex-grow rounded text-justify" style={{ backgroundColor, backgroundImage }}>{displayedText}</div>
      <div className="py-2">{stringifyApplicability(applicability)}</div>
    </div>
  );
}
