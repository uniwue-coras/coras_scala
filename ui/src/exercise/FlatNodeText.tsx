import {FlatSolutionNodeFragment, NounMatchingResultFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {useDrag, useDrop} from 'react-dnd';
import {SideSelector} from './NewCorrectSolutionContainer';
import classNames from 'classnames';
import {DragStatusProps} from './FlatSolutionNodeDisplay';
import {stringifyApplicability} from '../model/applicability';
import {markText} from './textMarker';

interface IProps {
  side: SideSelector;
  depth: number;
  node: FlatSolutionNodeFragment;
  dragProps: DragStatusProps;
  backgroundColor: string | undefined;
  matchExplanation: NounMatchingResultFragment | undefined;
}

type DragDropProps = { side: SideSelector, id: number };
type DropProps = { canDrop: boolean; isOver: boolean; }

const dragDropType = 'flatNodeText';
const defaultClasses = 'my-2 p-2 rounded font-bold';

export function FlatNodeText({side, depth, node, dragProps, backgroundColor, matchExplanation}: IProps): JSX.Element {

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

  const realText = matchExplanation
    ? markText(text,side, matchExplanation)
    : text;

  return (
    <span ref={draggedSide ? dropRef : dragRef} className={classNames(defaultClasses, {'bg-slate-500': draggedSide && canDrop && isOver})}>
      {getBullet(depth, childIndex)}.
      &nbsp;
      <span className="my-2 p-2 rounded" style={{backgroundColor}}>
        {realText}
      </span>
      &nbsp;
      {stringifyApplicability(applicability)}
    </span>
  );
}
