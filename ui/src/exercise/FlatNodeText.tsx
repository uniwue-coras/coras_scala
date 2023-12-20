import { AnnotationFragment, AnnotationInput, ErrorType, SolutionNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { SideSelector } from './CorrectSolutionView';
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
  currentEditedAnnotation: AnnotationInput | undefined;
  focusedAnnotation: AnnotationFragment | undefined;
  onClick: () => void;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

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
  node: { id, text, childIndex, applicability },
  mainMatchColor,
  dragProps: { draggedSide, setDraggedSide, onDrop },
  currentEditedAnnotation,
  focusedAnnotation,
  onClick,
}: IProps): ReactElement {

  const dragRef = useDrag<DragDropProps>({
    type: dragDropType,
    item: () => {
      setDraggedSide(side);
      return { side, id };
    },
    end: () => setDraggedSide(undefined)
  })[1];

  const [{ isOver, canDrop }, dropRef] = useDrop<DragDropProps, unknown, DropProps>({
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

  const classes = classNames('my-1 p-1 rounded font-bold', { 'bg-slate-500': draggedSide !== undefined && canDrop && isOver });

  return (
    <div id={`node_user_${id}`} className={classes}>
      <span className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef} onClick={onClick}>
        {getBullet(depth, childIndex)}.
      </span>
      &nbsp;
      <span className="my-2 p-1 rounded" style={{ backgroundColor }}>{markedText}</span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </div>
  );
}
