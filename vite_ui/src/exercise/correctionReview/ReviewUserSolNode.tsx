import { NodeDisplayProps } from '../BasicNodeDisplay';
import { ReactElement, useState } from 'react';
import { AnnotationFragment, FlatUserSolutionNodeFragment } from '../../graphql';
import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../SideSelector';
import { SelectionState } from '../selectionState';
import { AnnotationView } from '../AnnotationView';
import { allMatchColors } from '../../allMatchColors';
import { dummyDragProps } from '../dragStatusProps';

export function ReviewUserSolNode({ currentNode, matches, depth }: NodeDisplayProps<FlatUserSolutionNodeFragment>): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const maybeMatch = matches.find(({ userNodeId }) => currentNode.id === userNodeId);

  const mainMatchColor = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleNodeId]
    : undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <section className="col-span-2 flex">
        <FlatNodeText side={SideSelector.User} selectionState={SelectionState.None} depth={depth} node={currentNode} dragProps={dummyDragProps}
          mainMatchColor={mainMatchColor} onClick={() => void 0}
          currentEditedAnnotation={undefined} focusedAnnotation={focusedAnnotation} />

        <div className="ml-8">
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)} />
          )}
        </div>
      </section>
    </div>
  );
}
