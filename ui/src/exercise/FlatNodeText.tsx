import {FlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {ColoredMatch, SideSelector} from './NewCorrectSolutionContainer';
import classNames from 'classnames';
import {DragStatusProps} from './FlatSolutionNodeDisplay';
import {stringifyApplicability} from '../model/applicability';
import {MarkedText} from './textMarker';

interface IProps {
  side: SideSelector;
  depth: number;
  node: FlatSolutionNodeFragment;
  mainMatch: ColoredMatch | undefined;
  dragProps: DragStatusProps;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

const dragDropType = 'flatNodeText';
const defaultClasses = 'my-2 p-2 rounded font-bold';

export function FlatNodeText({side, depth, node, mainMatch, dragProps}: IProps): JSX.Element {

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
    collect: (monitor) => ({canDrop: monitor.canDrop(), isOver: monitor.isOver()})
  });

  const backgroundColor = mainMatch
    ? mainMatch.color
    : undefined;

  const realText = mainMatch && mainMatch.explanation
    ? <MarkedText text={text} side={side} backgroundColor={backgroundColor} nmr={mainMatch.explanation}/>
    : <span className="my-2 p-2 rounded" style={{backgroundColor}}>{text}</span>;

  return (
    <span ref={draggedSide ? dropRef : dragRef} className={classNames(defaultClasses, {'bg-slate-500': draggedSide && canDrop && isOver})}>
      {getBullet(depth, childIndex)}.
      &nbsp;
      {realText}
      &nbsp;
      {stringifyApplicability(applicability)}
    </span>
  );
}
