import { AnnotationFragment, AnnotationInput, ErrorType, SolutionNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from './SideSelector';
import { stringifyApplicability } from '../model/applicability';
import { SelectionState } from './selectionState';
import { ReactElement } from 'react';
import { DragStatusProps } from './BasicNodeDisplay';
import classNames from 'classnames';

interface IProps {
  side: SideSelector;
  selectionState: SelectionState;
  depth: number;
  node: SolutionNodeFragment;
  mainMatchColor: string | undefined;
  dragProps: DragStatusProps;
  onClick: () => void;
  currentEditedAnnotation: AnnotationInput | undefined;
  focusedAnnotation: AnnotationFragment | undefined;
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

export function FlatNodeText({
  side,
  selectionState,
  depth,
  node,
  mainMatchColor,
  dragProps,
  onClick,
  currentEditedAnnotation,
  focusedAnnotation
}: IProps): ReactElement {

  const { id, text, childIndex, applicability, isSubText } = node;
  const { draggedSide, setDraggedSide, onDrop } = dragProps;

  const dragRef = useDrag<DragDropProps>({
    type: dragDropType,
    item: () => {
      setDraggedSide(side);
      return { side, id };
    },
    // TODO: use collect instead of draggedSide!
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => setDraggedSide(undefined)
  })[1];

  const [{ isOver, canDrop }, dropRef] = useDrop<DragDropProps, unknown, { canDrop: boolean; isOver: boolean; }>({
    accept: dragDropType,
    canDrop: ({ side: draggedSide }) => draggedSide !== side,
    drop: async ({ side: otherSide, id: otherId }): Promise<void> => {
      setDraggedSide(undefined);

      otherSide === SideSelector.Sample
        ? await onDrop(otherId, id)
        : await onDrop(id, otherId);
    },
    collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() })
  });

  const backgroundColor = selectionState !== SelectionState.Other ? mainMatchColor : undefined;

  const markedText = getMarkedText(text, currentEditedAnnotation, focusedAnnotation) || text;

  const classes = classNames('my-1 p-1 rounded space-x-2', { 'bg-slate-500': draggedSide !== undefined && canDrop && isOver, 'font-bold': !isSubText });

  return (
    <div id={`node_user_${id}`} className={classes}>
      {!isSubText &&
        <div className="inline-block p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef} onClick={onClick}>
          {getBullet(depth, childIndex)}.
        </div>}
      <span className="p-1 rounded" style={{ backgroundColor }}>{markedText}</span>
      <span>{stringifyApplicability(applicability)}</span>
    </div>
  );
}
