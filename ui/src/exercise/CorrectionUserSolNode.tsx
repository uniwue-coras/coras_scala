import { FlatNodeText } from './FlatNodeText';
import { SideSelector } from './CorrectSolutionView';
import { getSelectionState, SelectionState } from './selectionState';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from './AnnotationView';
import { AnnotationFragment, FlatUserSolutionNodeFragment } from '../graphql';
import { CurrentSelection } from './currentSelection';
import { MatchEdit } from './MatchEdit';
import { allMatchColors } from '../allMatchColors';
import { CorrectionNodeTextDisplayProps } from './CorrectionNodeTextDisplayProps';

interface IProps extends CorrectionNodeTextDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

export function UserNodeTextDisplay({
  node,
  selectedNodeId,
  dragProps,
  matches,
  matchEditData,
  depth,
  currentSelection,
  annotationEditingProps,
  onClick,
  onRemoveAnnotation,
  onEditAnnotation,
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const maybeMatch = matches.find(({ userNodeId }) => node.id === userNodeId);

  const mainMatchColor: string | undefined = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleNodeId]
    : undefined;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, node.id);

  const editedAnnotation = currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === node.id
    ? currentSelection
    : undefined;

  const matchEditDataForNode = matchEditData !== undefined && matchEditData.markedNodeSide === SideSelector.User && matchEditData.markedNode.id === node.id
    ? matchEditData
    : undefined;

  const editAnnotationProps = (annotationId: number): EditAnnotationProps => ({
    editAnnotation: () => onEditAnnotation(node.id, annotationId),
    removeAnnotation: () => onRemoveAnnotation(node.id, annotationId)
  });

  return (
    <>
      <section className="flex space-x-4">
        <div>
          <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={node} dragProps={dragProps}
            mainMatchColor={mainMatchColor} onClick={onClick}
            currentEditedAnnotation={editedAnnotation?.annotationInput} focusedAnnotation={focusedAnnotation} />

          {/*node.subTexts.map((s, index) => <p key={index}>{s}</p>)*/}
        </div>

        <div>
          {node.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editProps={editAnnotationProps(annotation.id)} />
          )}
        </div>
      </section>

      {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps} />}

      {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
    </>
  );
}

