import {FlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {SideSelector} from './NewCorrectSolutionContainer';
import classNames from 'classnames';
import {DragStatusProps} from './FlatSolutionNodeDisplay';
import {stringifyApplicability} from '../model/applicability';

interface IProps {
  side: SideSelector;
  depth: number;
  node: FlatSolutionNodeFragment;
  dragProps: DragStatusProps;
}

type DragDropProps = { side: SideSelector, id: number };

type DropProps = {
  canDrop: boolean;
  isOver: boolean;
}

const dragDropType = 'flatNodeText';

export function FlatNodeText({side, depth, node, dragProps}: IProps): JSX.Element {

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

      otherSide === SideSelector.Sample
        ? onDrop(otherId, id)
        : onDrop(id, otherId);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    })
  });


  return draggedSide ? (
    <span ref={dropRef} className={classNames({'bg-slate-500': canDrop && isOver})}>
      {getBullet(depth, childIndex)}. {text} {stringifyApplicability(applicability)}
    </span>
  ) : (
    <span ref={dragRef}>
      {getBullet(depth, childIndex)}. {text} {stringifyApplicability(applicability)}
    </span>
  );
}
