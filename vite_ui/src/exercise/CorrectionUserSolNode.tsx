import { FlatNodeText } from './FlatNodeText';
import { SideSelector } from './SideSelector';
import { getSelectionState, SelectionState } from './selectionState';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from './AnnotationView';
import { AnnotationFragment, FlatUserSolutionNodeFragment } from '../graphql';
import { CurrentSelection } from './currentSelection';
import { MatchEdit } from './MatchEdit';
import { BasicNodeDisplay, CorrectionNodeDisplayProps } from './BasicNodeDisplay';
import { allMatchColors } from '../allMatchColors';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

function UserNodeTextDisplay({
  currentNode,
  selectedNodeId,
  onNodeClick,
  dragProps,
  matches,
  matchEditData,
  depth,
  currentSelection,
  onRemoveAnnotation,
  onEditAnnotation,
  annotationEditingProps
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const maybeMatch = matches.find(({ userNodeId }) => currentNode.id === userNodeId);

  const mainMatchColor: string | undefined = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleNodeId]
    : undefined;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const editedAnnotation = currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === currentNode.id
    ? currentSelection
    : undefined;

  const matchEditDataForNode = matchEditData !== undefined && matchEditData.markedNodeSide === SideSelector.User && matchEditData.markedNode.id === currentNode.id
    ? matchEditData
    : undefined;

  const editAnnotationProps = (annotationId: number): EditAnnotationProps => ({
    editAnnotation: () => onEditAnnotation(currentNode.id, annotationId),
    removeAnnotation: () => onRemoveAnnotation(currentNode.id, annotationId)
  });

  return (
    <>
      <section className="flex space-x-4">
        <div>
          <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
            mainMatchColor={mainMatchColor} onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}
            currentEditedAnnotation={editedAnnotation?.annotationInput} focusedAnnotation={focusedAnnotation} />
        </div>

        <div>
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
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

export function CorrectionUserSolNode(props: IProps): ReactElement {
  return (
    <BasicNodeDisplay otherProps={props}>
      {(textProps) => <UserNodeTextDisplay {...textProps} />}
    </BasicNodeDisplay>
  );
}
