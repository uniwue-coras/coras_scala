import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../SideSelector';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from '../AnnotationView';
import { Correctness, FlatUserSolutionNodeFragment } from '../../graphql';
import { CurrentSelection } from '../currentSelection';
import { MatchEdit } from '../MatchEdit';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import { isDefined } from '../../funcs';
import { MatchCorrectnessSignals } from './MatchCorrectnessSignals';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
  onUpdateCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
}

export function CorrectionUserNodeDisplay({
  node,
  matchEditData,
  currentSelection,
  annotationEditingProps,
  ownMatches,
  onRemoveAnnotation,
  onEditAnnotation,
  onUpdateCorrectness,
  onUpdateParagraphCitationCorrectness,
  onUpdateExplanationCorrectness,
  ...otherProps
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnn = isDefined(focusedAnnotationId)
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const editedAnnotation = isDefined(currentSelection) && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === node.id
    ? currentSelection
    : undefined;

  const matchEditDataForNode = isDefined(matchEditData) && matchEditData.markedNodeSide === SideSelector.User && matchEditData.markedNode.id === node.id
    ? matchEditData
    : undefined;

  const editAnnotationProps = (annotationId: number): EditAnnotationProps => ({
    editAnnotation: () => onEditAnnotation(node.id, annotationId),
    removeAnnotation: () => onRemoveAnnotation(node.id, annotationId)
  });

  return (
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...otherProps} node={node} ownMatches={ownMatches} focusedAnnotation={focusedAnn} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div className="flex flew-row items-start space-x-2">
        {!node.isSubText && ownMatches.map((m, index) =>
          <MatchCorrectnessSignals key={index} match={m} {...{ onUpdateCorrectness, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }} />
        )}

        <div className="flex-grow">
          {node.annotations.map((annotation) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editProps={editAnnotationProps(annotation.id)} />
          )}

          {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps} />}

          {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
        </div>
      </div>

    </div>
  );
}
