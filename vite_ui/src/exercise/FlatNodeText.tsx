import { AnnotationFragment, AnnotationInput, ErrorType, SolutionNodeMatchFragment, SolutionNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from './SideSelector';
import { stringifyApplicability } from '../model/applicability';
import { ReactElement } from 'react';
import { BasicNodeDisplayProps } from './nodeDisplayProps';
import { getBackground } from '../solutionNodeMatch';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps extends BasicNodeDisplayProps<SolutionNodeFragment> {
  isSample: boolean;
  ownMatches: SolutionNodeMatchFragment[];
  currentEditedAnnotation?: AnnotationInput | undefined;
  focusedAnnotation?: AnnotationFragment | undefined;
  onDragDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

export interface DragItem {
  isSample: boolean;
  nodeId: number;
}

type DragDropProps = { side: SideSelector, id: number };
const dragDropType = 'flatNodeText';

function getMarkedText(
  text: string,
  currentEditedAnnotation: AnnotationInput | undefined,
  focusedAnnotation: AnnotationFragment | undefined
): ReactElement | undefined {
  const annotationToMark = currentEditedAnnotation !== undefined
    ? currentEditedAnnotation
    : focusedAnnotation;

  if (annotationToMark === undefined) {
    return undefined;
  }

  const { startIndex, endIndex } = annotationToMark;

  const bgColor: string = {
    [ErrorType.Missing]: 'bg-amber-500',
    [ErrorType.Wrong]: 'bg-red-500'
  }[annotationToMark.errorType];

  return (
    <>
      <span>{text.substring(0, startIndex)}</span>
      <span className={bgColor}>{text.substring(startIndex, endIndex)}</span>
      <span>{text.substring(endIndex)}</span>
    </>
  );
}

export function FlatNodeText({ isSample, index, depth, node, ownMatches, currentEditedAnnotation, focusedAnnotation, onDragDrop, }: IProps): ReactElement {

  const { id, text, isSubText, applicability } = node;

  const [draggedSide, dragRef] = useDrag<DragItem, unknown, SideSelector | undefined>({
    type: dragDropType,
    item: { isSample, nodeId: id },
    collect: (monitor) => {
      const item = monitor.getItem();
      return item !== null ? (item.isSample ? SideSelector.Sample : SideSelector.User) : undefined;
    }
  });

  const [mark, dropRef] = useDrop<DragDropProps, unknown, boolean>({
    accept: dragDropType,
    canDrop: ({ side: draggedSide }) => draggedSide !== undefined && draggedSide !== (isSample ? SideSelector.Sample : SideSelector.User),
    drop: async ({ side: otherSide, id: otherId }): Promise<void> => {

      otherSide === SideSelector.Sample
        ? await onDragDrop(otherId, id)
        : await onDragDrop(id, otherId);
    },
    collect: (monitor) => monitor.canDrop() && monitor.isOver()
  });

  const { backgroundColor, backgroundImage } = getBackground(false, ownMatches);

  const markedText = getMarkedText(text, currentEditedAnnotation, focusedAnnotation) || text;

  return (
    <div id={`node_user_${id}`} className={classNames('flex items-start space-x-2', { 'font-bold': !isSubText })} style={{ marginLeft: `${indentInPixel * depth}px` }}>
      {!isSubText &&
        <div ref={draggedSide ? dropRef : dragRef} className={classNames('p-2 rounded border border-slate-500', { 'bg-slate-300': draggedSide !== undefined && mark })}>
          {isSubText
            ? <span className="italic">&lt;&gt;</span>
            : <>{getBullet(depth, index)}.</>}
        </div>}
      <span className="p-2 flex-grow rounded text-justify" style={{ backgroundColor, backgroundImage }}>{markedText}</span>
      <span className="p-2">{stringifyApplicability(applicability)}</span>
    </div>
  );
}
