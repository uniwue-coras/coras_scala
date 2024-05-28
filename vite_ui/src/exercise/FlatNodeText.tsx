import { AnnotationFragment, AnnotationInput, ErrorType, SolutionNodeMatchFragment, SolutionNodeFragment } from '../graphql';
import { getBullet } from '../model/bulletTypes';
import { useDrag, useDrop } from 'react-dnd';
import { stringifyApplicability } from '../model/enums';
import { ReactElement } from 'react';
import { BasicNodeDisplayProps } from './nodeDisplayProps';
import { getBackground } from '../solutionNodeMatch';
import classNames from 'classnames';
import { isDefined } from '../funcs';

const indentInPixel = 20;

interface IProps extends BasicNodeDisplayProps<SolutionNodeFragment> {
  isSample: boolean;
  ownMatches: SolutionNodeMatchFragment[];
  currentEditedAnnotation?: AnnotationInput | undefined;
  focusedAnnotation?: AnnotationFragment | undefined;
  onDragDrop?: (sampleNodeId: number, userNodeId: number) => void;
}

const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

interface DragItem {
  isSample: boolean;
  nodeId: number;
}

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
    [ErrorType.Neutral]: 'bg-slate-500',
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

export function FlatNodeText({ isSample, index, depth, node, ownMatches, currentEditedAnnotation, focusedAnnotation, onDragDrop }: IProps): ReactElement {

  const { id, text, isSubText, applicability } = node;

  const [draggedSide, dragRef] = useDrag<DragItem, unknown, SideSelector | undefined>({
    type: dragDropType,
    item: { isSample, nodeId: id },
    collect: (monitor) => {
      const item = monitor.getItem();
      return item !== null ? (item.isSample ? SideSelector.Sample : SideSelector.User) : undefined;
    }
  });

  const [mark, dropRef] = useDrop<DragItem, unknown, boolean>({
    accept: dragDropType,
    canDrop: ({ isSample }) => draggedSide !== undefined && draggedSide !== (isSample ? SideSelector.User : SideSelector.Sample),
    collect: (monitor) => monitor.canDrop() && monitor.isOver(),
    drop: ({ isSample, nodeId: otherId }) => isDefined(onDragDrop) && (isSample ? onDragDrop(otherId, id) : onDragDrop(id, otherId))
  });

  const { backgroundColor, backgroundImage } = getBackground(false, ownMatches);
  const markedText = getMarkedText(text, currentEditedAnnotation, focusedAnnotation) || text;

  const ref = isDefined(onDragDrop) ? (draggedSide ? dropRef : dragRef) : undefined;

  return (
    <div id={`node_user_${id}`} className={classNames('flex items-start space-x-2', { 'font-bold': !isSubText })} style={{ marginLeft: `${indentInPixel * depth}px` }}>
      {!isSubText &&
        <div ref={ref} className={classNames('p-2 rounded border border-slate-500', { 'bg-slate-300': mark })}>
          {isSubText
            ? <span className="italic">&lt;&gt;</span>
            : <>{getBullet(depth, index)}.</>}
        </div>}
      <span className="p-2 flex-grow rounded text-justify" style={{ backgroundColor, backgroundImage }}>{markedText}</span>
      <span className="p-2">{stringifyApplicability(applicability)}</span>
    </div>
  );
}
