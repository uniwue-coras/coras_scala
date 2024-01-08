import { ReactElement, useState } from 'react';
import { AnnotationFragment, FlatUserSolutionNodeFragment } from '../../graphql';
import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../CorrectSolutionView';
import { SelectionState } from '../selectionState';
import { AnnotationView } from '../AnnotationView';
import { allMatchColors } from '../../allMatchColors';
import { dummyDragProps } from './ReviewSampleSolNode';
import { NodeTextDisplayProps } from '../../solutionDisplay/SolutionNodeDisplay';

export function ReviewUserSolNode({ node, ownMatch, depth }: NodeTextDisplayProps<FlatUserSolutionNodeFragment>): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const mainMatchColor = ownMatch !== undefined
    ? allMatchColors[ownMatch.sampleNodeId]
    : undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <section className="col-span-2 flex">
        <FlatNodeText side={SideSelector.User} selectionState={SelectionState.None} depth={depth} node={node} dragProps={dummyDragProps}
          mainMatchColor={mainMatchColor} currentEditedAnnotation={undefined} focusedAnnotation={focusedAnnotation} onClick={() => void 0} />

        <div className="ml-8">
          {node.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)} />
          )}
        </div>
      </section>
    </div>
  );
}
