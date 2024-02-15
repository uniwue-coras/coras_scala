import { Fragment, ReactElement } from 'react';
import { CurrentMatchFragment, ParagraphCitationLocationFragment, RevSolNodeFragment } from '../graphql';
import { stringifyApplicability } from '../model/applicability';
import { allMatchColors } from '../allMatchColors';
import { stringifyParagraphCitation } from './paragraphCitation';
import { getBullet } from '../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from '../exercise/CorrectSolutionView';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  isSample: boolean;
  matchCurrentlyExamined: CurrentMatchFragment | undefined;
  onNodeClick: (isSample: boolean, nodeId: number) => void;
  depth: number;
  node: RevSolNodeFragment;
  ownMatch: CurrentMatchFragment | undefined;
  onDragDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
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

function matchesEqual(m1: CurrentMatchFragment, m2: CurrentMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

const dragDropType = 'matchExaminationDrag';

export function MatchingReviewNodeDisplay({ isSample, depth, node, ownMatch, matchCurrentlyExamined, onNodeClick, onDragDrop }: IProps): ReactElement {

  const { id, childIndex, text, isSubText, applicability, paragraphCitationLocations } = node;

  const background = ownMatch && !matchCurrentlyExamined ? allMatchColors[ownMatch.sampleNodeId] : undefined;
  const border = ownMatch && matchCurrentlyExamined && matchesEqual(matchCurrentlyExamined, ownMatch)
    ? `2px solid ${allMatchColors[ownMatch?.sampleNodeId]}`
    : undefined;

  // underline paragraph citation locations, show cited paragraphs as tooltip
  const displayedText = paragraphCitationLocations.length === 0
    ? text
    : underlineParagraphCitationLocationsInText(text, paragraphCitationLocations);

  const [{ draggedSide }, dragRef] = useDrag<DragItem, unknown, { draggedSide: SideSelector | undefined }>({
    type: dragDropType,
    item: ({ isSample, nodeId: id }),
    collect: (monitor) => {
      const item: DragItem | null = monitor.getItem();

      return {
        draggedSide: item !== null
          ? (
            item.isSample ? SideSelector.Sample : SideSelector.User
          ) : undefined
      };
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
