import { ReactElement } from 'react';
import { DragStatusProps } from '../BasicNodeDisplay';
import { allMatchColors } from '../../allMatchColors';
import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../CorrectSolutionView';
import { SelectionState } from '../selectionState';
import { SolutionNodeFragment, SolutionNodeMatchFragment } from '../../graphql';
import classNames from 'classnames';

interface IProps {
  node: SolutionNodeFragment;
  depth: number;
  ownMatch: SolutionNodeMatchFragment | undefined;
  parentMatched: boolean;
}

export const dummyDragProps: DragStatusProps = {
  draggedSide: undefined,
  setDraggedSide: () => void 0,
  onDrop: () => new Promise((resolve, reject) => reject('TODO!'))
};

export function ReviewSampleSolNode({ node, ownMatch, parentMatched, depth }: IProps): ReactElement {

  const mainMatchColor = ownMatch !== undefined
    ? allMatchColors[ownMatch.sampleNodeId]
    : undefined;

  return (
    <div>
      <div className={classNames({ 'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined })}>
        <FlatNodeText side={SideSelector.Sample} selectionState={SelectionState.None} node={node} dragProps={dummyDragProps}
          mainMatchColor={mainMatchColor} depth={depth} onClick={() => void 0} focusedAnnotation={undefined} currentEditedAnnotation={undefined} />
      </div>
    </div>
  );
}
