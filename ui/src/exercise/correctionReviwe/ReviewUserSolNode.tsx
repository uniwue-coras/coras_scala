import {NodeDisplayProps} from '../BasicNodeDisplay';
import {JSX, useState} from 'react';
import {AnnotationFragment, FlatUserSolutionNodeFragment} from '../../graphql';
import {FlatNodeText} from '../FlatNodeText';
import {SideSelector} from '../CorrectSolutionView';
import {SelectionState} from '../selectionState';
import {AnnotationView} from '../AnnotationView';
import {allMatchColors} from '../../allMatchColors';
import {dummyDragProps} from './ReviewSampleSolNode';

export function ReviewUserSolNode({currentNode, allNodes, matches, depth}: NodeDisplayProps<FlatUserSolutionNodeFragment>): JSX.Element {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({id}) => id === focusedAnnotationId)
    : undefined;

  const maybeMatch = matches.find(({userValue}) => currentNode.id === userValue);

  const mainMatchColor = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleValue]
    : undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <section className="col-span-2 flex">
        <FlatNodeText side={SideSelector.User} selectionState={SelectionState.None} depth={depth} node={currentNode} dragProps={dummyDragProps}
          mainMatchColor={mainMatchColor} onClick={() => void 0}
          currentEditedAnnotation={undefined} focusedAnnotation={focusedAnnotation}/>

        <div className="ml-8">
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editAnnotation={() => void 0}
              removeAnnotation={() => void 0}/>
          )}
        </div>
      </section>
    </div>
  );
}
