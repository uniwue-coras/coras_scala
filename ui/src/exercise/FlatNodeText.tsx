import {FlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {ColoredMatch, SideSelector} from './NewCorrectSolutionContainer';
import {DragStatusProps} from './FlatSolutionNodeDisplay';
import {stringifyApplicability} from '../model/applicability';
import classNames from 'classnames';
import {SelectionState} from './selectionState';

interface IProps {
  side: SideSelector;
  selectionState: SelectionState;
  depth: number;
  node: FlatSolutionNodeFragment;
  mainMatch: ColoredMatch | undefined;
  dragProps: DragStatusProps;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

const dragDropType = 'flatNodeText';
const defaultClasses = 'my-2 p-2 rounded font-bold';

export function FlatNodeText({side, selectionState, depth, node, mainMatch, dragProps}: IProps): JSX.Element {

  const {id, text, childIndex, applicability} = node;
  const {draggedSide, setDraggedSide, onDrop} = dragProps;

  const dragRef = useDrag<DragDropProps>({
    type: dragDropType,
    item: () => {
      setDraggedSide(side);
      return {side, id};
    },
    end: () => setDraggedSide()
  })[1];

  const [{isOver, canDrop}, dropRef] = useDrop<DragDropProps, unknown, DropProps>({
    accept: dragDropType,
    canDrop: ({side: draggedSide}) => draggedSide !== side,
    drop: ({side: otherSide, id: otherId}) => {
      setDraggedSide(undefined);

      otherSide === SideSelector.Sample ? onDrop(otherId, id) : onDrop(id, otherId);
    },
    collect: (monitor) => ({canDrop: monitor.canDrop(), isOver: monitor.isOver()})
  });

  const [myClassNames, backgroundColor] = {
    [SelectionState.None]: ['my-2 p-1 rounded', mainMatch?.color],
    [SelectionState.This]: ['my-2 p-1 rounded', mainMatch?.color],
    [SelectionState.Match]: ['my-2 p-1 rounded', mainMatch?.color],
    [SelectionState.Other]: ['my-2 p-1 rounded', undefined],
  }[selectionState];

  return (
    <span ref={draggedSide ? dropRef : dragRef} className={classNames(defaultClasses, {'bg-slate-500': draggedSide && canDrop && isOver})}>
      {getBullet(depth, childIndex)}.
      &nbsp;
      <span className={myClassNames} style={{backgroundColor}}>{text}</span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </span>
  );
}
