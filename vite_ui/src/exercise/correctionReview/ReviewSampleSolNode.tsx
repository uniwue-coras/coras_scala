import { ReactElement } from 'react';
import { NodeDisplayProps } from '../BasicNodeDisplay';
import { allMatchColors } from '../../allMatchColors';
import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../SideSelector';
import { SelectionState } from '../selectionState';
import { dummyDragProps } from '../dragStatusProps';
import classNames from 'classnames';

interface IProps extends NodeDisplayProps {
  parentMatched: boolean;
}

export function ReviewSampleSolNode({/*allNodes,*/ currentNode, parentMatched, matches, depth }: IProps): ReactElement {

  const maybeMatch = matches.find(({ sampleNodeId }) => currentNode.id === sampleNodeId);

  const mainMatchColor = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleNodeId]
    : undefined;

  return (
    <div>
      <div className={classNames({ 'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined && !currentNode.isSubText })}>
        <FlatNodeText side={SideSelector.Sample} selectionState={SelectionState.None} node={currentNode} dragProps={dummyDragProps}
          mainMatchColor={mainMatchColor}
          depth={depth} onClick={() => void 0} focusedAnnotation={undefined} currentEditedAnnotation={undefined} />
      </div>
    </div>
  );
}
