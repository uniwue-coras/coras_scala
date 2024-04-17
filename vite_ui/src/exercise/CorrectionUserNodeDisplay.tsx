import { FlatNodeText } from './FlatNodeText';
import { SideSelector } from './SideSelector';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from './AnnotationView';
import { FlatUserSolutionNodeFragment } from '../graphql';
import { CurrentSelection } from './currentSelection';
import { MatchEdit } from './MatchEdit';
import { CorrectionNodeDisplayProps } from './nodeDisplayProps';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

export function CorrectionUserNodeDisplay({
  node,
  ownMatches: matches,
  matchEditData,
  currentSelection,
  annotationEditingProps,
  onDrop,
  onRemoveAnnotation,
  onEditAnnotation,
  ...otherProps
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

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
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...otherProps} node={node} ownMatches={matches.filter(({ userNodeId }) => userNodeId === node.id)} focusedAnnotation={focusedAnnotation}
        currentEditedAnnotation={editedAnnotation?.annotationInput} onDragDrop={onDrop} />

      <div>
        {node.annotations.map((annotation) =>
          <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
            onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
            editProps={editAnnotationProps(annotation.id)} />
        )}
        {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps} />}

        {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
      </div>
    </div>
  );
}
