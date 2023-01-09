import {FlatSolutionNodeFragment} from '../graphql';
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
  node: FlatSolutionNodeFragment;
  mainMatchColor: IColor | undefined;
  dragProps: DragStatusProps;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

const dragDropType = 'flatNodeText';
const defaultClasses = 'my-2 p-2 rounded font-bold';

export function FlatNodeText({side, selectionState, depth, node, mainMatchColor, dragProps}: IProps): JSX.Element {

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

  const backgroundColor = selectionState !== SelectionState.Other
    ? mainMatchColor?.hex
    : undefined;

  return (
    <span ref={draggedSide ? dropRef : dragRef} className={classNames(defaultClasses, {'bg-slate-500': draggedSide && canDrop && isOver})}>
      {getBullet(depth, childIndex)}.
      &nbsp;
      <span className={classNames('my-2 p-1 rounded', {'text-white': mainMatchColor?.isDark && selectionState !== SelectionState.Other})}
            style={{backgroundColor}}>{text}</span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </span>
  );
}
