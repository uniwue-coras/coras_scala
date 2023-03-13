import {AnnotationFragment, AnnotationInput, ErrorType, IFlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {SideSelector} from './CorrectSolutionView';
import {DragStatusProps} from './UserSolutionNodeDisplay';
import {stringifyApplicability} from '../model/applicability';
import classNames from 'classnames';
import {SelectionState} from './selectionState';
import {IColor} from '../colors';

interface IProps {
  side: SideSelector;
  selectionState: SelectionState;
  depth: number;
  node: IFlatSolutionNodeFragment;
  mainMatchColor: IColor | undefined;
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
    drop: ({side: otherSide, id: otherId}) => {
      setDraggedSide(undefined);

      otherSide === SideSelector.Sample
        ? onDrop(otherId, id)
        : onDrop(id, otherId);
    },
    collect: (monitor) => ({canDrop: monitor.canDrop(), isOver: monitor.isOver()})
  });

  const backgroundColor = selectionState !== SelectionState.Other
    ? mainMatchColor?.hex
    : undefined;

  const markedText = getMarkedText(text, currentEditedAnnotation, focusedAnnotation) || text;

  return (
    <div id={`node_user_${id}`} className={classNames('my-1 p-1 rounded', {'bg-slate-500': draggedSide && canDrop && isOver, 'font-bold': !isSubText})}>
      {!isSubText &&
        <span className="p-2 rounded border border-slate-500" ref={draggedSide ? dropRef : dragRef} onClick={onClick}>
          {getBullet(depth, childIndex)}.
        </span>}
      &nbsp;
      <span className={classNames('my-2 p-1 rounded', {'text-white': mainMatchColor?.isDark && selectionState !== SelectionState.Other})}
            style={{backgroundColor}}>
        {markedText}
      </span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </div>
  );
}
