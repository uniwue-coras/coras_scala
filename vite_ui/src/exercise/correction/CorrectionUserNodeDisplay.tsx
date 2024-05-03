import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../SideSelector';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from '../AnnotationView';
import { Correctness, FlatUserSolutionNodeFragment, ParagraphCitationAnnotationInput } from '../../graphql';
import { CurrentSelection } from '../currentSelection';
import { MatchEdit } from '../MatchEdit';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import { isDefined } from '../../funcs';
import { MatchCorrectnessSignals } from './MatchCorrectnessSignals';
import { ParCitAnnoKey, ParagraphCitationAnnotationsView } from './ParagraphCitationAnnotationsView';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection: CurrentSelection | undefined;
  annotationEditingProps: AnnotationEditingProps;
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => void;
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
}

export function CorrectionUserNodeDisplay({
  node,
  matchEditData,
  currentSelection,
  annotationEditingProps,
  ownMatches,
  setKeyHandlingEnabled,
  onDeleteMatch,
  onRemoveAnnotation,
  onEditAnnotation,
  onSubmitParagraphCitationAnnotation,
  onUpdateParagraphCitationCorrectness,
  onUpdateParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
  onUpdateExplanationCorrectness,
  ...otherProps
}: IProps): ReactElement {

  const { isSubText, paragraphCitationAnnotations, annotations } = node;

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = isDefined(focusedAnnotationId)
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
      <FlatNodeText isSample={false} {...otherProps} {...{ node, ownMatches, focusedAnnotation }} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div className="flex flew-row items-start space-x-2">
        {!isSubText && ownMatches.map((m, index) =>
          <MatchCorrectnessSignals key={index} match={m} {...{ onDeleteMatch, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }} />
        )}

        <div className="flex-grow">
          {paragraphCitationAnnotations.length > 0 && <ParagraphCitationAnnotationsView
            onSubmitParagraphCitationAnnotation={(sampleNodeId, parCitAnno) => onSubmitParagraphCitationAnnotation(sampleNodeId, node.id, parCitAnno)}
            {...{ paragraphCitationAnnotations, setKeyHandlingEnabled, onDeleteParagraphCitationAnnotation, onUpdateParagraphCitationAnnotation }} />}

          <div>
            {annotations.map((annotation) =>
              <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
                onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
                editProps={editAnnotationProps(annotation.id)} />
            )}
          </div>

          {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps} />}

          {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
        </div>
      </div>

    </div>
  );
}
