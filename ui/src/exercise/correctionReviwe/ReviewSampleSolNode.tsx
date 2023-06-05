import {JSX} from 'react';
import {DragStatusProps, NodeDisplayProps} from '../BasicNodeDisplay';
import {allMatchColors} from '../../allMatchColors';
import classNames from 'classnames';
import {FlatNodeText} from '../FlatNodeText';
import {SideSelector} from '../CorrectSolutionView';
import {SelectionState} from '../selectionState';

interface IProps extends NodeDisplayProps {
  parentMatched: boolean;
}

export const dummyDragProps: DragStatusProps = {
  draggedSide: undefined,
  setDraggedSide: () => void 0,
  onDrop: () => new Promise((resolve, reject) => reject('TODO!'))
};

export function ReviewSampleSolNode({allNodes, currentNode, parentMatched, matches, depth}: IProps): JSX.Element {

  const maybeMatch = matches.find(({sampleValue}) => currentNode.id === sampleValue);

  const mainMatchColor = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleValue]
    : undefined;

  return (
    <div>
      <div className={classNames({'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined && !currentNode.isSubText})}>
        <FlatNodeText side={SideSelector.Sample} selectionState={SelectionState.None} node={currentNode} dragProps={dummyDragProps} mainMatchColor={mainMatchColor}
          depth={depth} onClick={() => void 0} focusedAnnotation={undefined} currentEditedAnnotation={undefined}/>
      </div>
    </div>
  );
}
