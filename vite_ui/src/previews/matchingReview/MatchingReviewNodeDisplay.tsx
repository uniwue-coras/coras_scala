import { ReactElement } from 'react';
import { MatchingReviewSolNodeFragment } from '../../graphql';
import { stringifyApplicability } from '../../model/applicability';
import { allMatchColors } from '../../allMatchColors';
import { getBullet } from '../../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from '../../exercise/SideSelector';
import { MinimalSolutionNodeMatch, minimalSolutionNodeMatchesCorrespond } from '../../minimalSolutionNodeMatch';
import { TextWithUnderlinedParagraphCitations } from '../TextWithUnderlinedParagraphCitations';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  isSample: boolean;
  node: MatchingReviewSolNodeFragment;
  matchCurrentlyExamined: MinimalSolutionNodeMatch | undefined;
  ownMatch: MinimalSolutionNodeMatch | undefined;
  depth: number;
  onNodeClick: (isSample: boolean, nodeId: number) => void;
  onDragDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

const dragDropType = 'matchExaminationDrag';

export function MatchingReviewNodeDisplay({ isSample, depth, node, ownMatch, matchCurrentlyExamined, onNodeClick, onDragDrop }: IProps): ReactElement {

  const { id, childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

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
      const item: DragItem | null = monitor.getItem();

      return item !== null ? (item.isSample ? SideSelector.Sample : SideSelector.User) : undefined;
    }
  });

  const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, unknown, { canDrop: boolean, isOver: boolean }>({
    accept: dragDropType,
    canDrop: (/* item, monitor */) => draggedSide !== undefined && draggedSide !== (isSample ? SideSelector.Sample : SideSelector.User),
    collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    drop: async ({ nodeId, isSample }/*, monitor*/) => isSample ? onDragDrop(nodeId, id) : onDragDrop(id, nodeId)
  });

  return (
    <div className={classNames('flex', { 'font-bold': !isSubText, 'rounded border border-red-300': canDrop && isOver })} style={{ marginLeft: `${depth * indentInPixel}px` }} onClick={() => onNodeClick(isSample, id)}>
      {!isSubText && <div className="p-2 rounded border border-slate-500" ref={draggedSide !== undefined ? dropRef : dragRef} /* onClick={onClick}*/>
        {getBullet(depth, childIndex)}.
      </div>}
      <div className="mx-2 p-2 flex-grow rounded text-justify" style={{ background, border }}>{displayedText}</div>
      <div>{stringifyApplicability(applicability)}</div>
    </div>
  );
}
