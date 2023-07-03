import {AnnotationFragment, AnnotationInput, ErrorType, IFlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {SideSelector} from './CorrectSolutionView';
import {stringifyApplicability} from '../model/applicability';
import classNames from 'classnames';
import {SelectionState} from './selectionState';
import {JSX} from 'react';
import {DragStatusProps} from './BasicNodeDisplay';

interface IProps {
  side: SideSelector;
  selectionState: SelectionState;
  depth: number;
  node: IFlatSolutionNodeFragment;
  mainMatchColor: string | undefined;
  dragProps: DragStatusProps;
  onClick: () => void;
  currentEditedAnnotation: AnnotationInput | undefined;
  focusedAnnotation: AnnotationFragment | undefined;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

const dragDropType = 'flatNodeText';

function getMarkedText(
  text: string,
  currentEditedAnnotation: AnnotationInput | undefined,
  focusedAnnotation: AnnotationFragment | undefined
): JSX.Element | undefined {
  const annotationToMark = currentEditedAnnotation !== undefined
    ? currentEditedAnnotation
    : focusedAnnotation;

  if (annotationToMark === undefined) {
    return undefined;
  }

  const {startIndex, endIndex} = annotationToMark;

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
}: IProps): JSX.Element {

  const {id, text, childIndex, applicability, isSubText} = node;
  const {draggedSide, setDraggedSide, onDrop} = dragProps;

  const dragRef = useDrag<DragDropProps>({
    type: dragDropType,
    item: () => {
      setDraggedSide(side);
      return {side, id};
    },
    end: () => setDraggedSide(undefined)
  })[1];

  const [{isOver, canDrop}, dropRef] = useDrop<DragDropProps, unknown, DropProps>({
    accept: dragDropType,
    canDrop: ({side: draggedSide}) => draggedSide !== side,
    drop: async ({side: otherSide, id: otherId}): Promise<void> => {
      setDraggedSide(undefined);

      otherSide === SideSelector.Sample
        ? await onDrop(otherId, id)
        : await onDrop(id, otherId);
    },
    collect: (monitor) => ({canDrop: monitor.canDrop(), isOver: monitor.isOver()})
  });

  const backgroundColor = selectionState !== SelectionState.Other ? mainMatchColor : undefined;

  const markedText = getMarkedText(text, currentEditedAnnotation, focusedAnnotation) || text;

  const classes = classNames('my-1 p-1 rounded', {'bg-slate-500': draggedSide !== undefined && canDrop && isOver, 'font-bold': !isSubText});

  return (
    <div id={`node_user_${id}`} className={classes}>
      {!isSubText && (
        <span className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef} onClick={onClick}>
          {getBullet(depth, childIndex)}.
        </span>
      )}
      &nbsp;
      <span className="my-2 p-1 rounded" style={{backgroundColor}}>{markedText}</span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </div>
  );
}
