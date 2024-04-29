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
import { t } from 'i18next';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection: CurrentSelection | undefined;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
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
          <MatchCorrectnessSignals key={index} match={m} {...{ onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }} />
        )}

        <div className="flex-grow">
          {node.paragraphCitationAnnotations.length > 0 && <div className="p-2 rounded border border-red-600">
            <span className="font-bold">{t('missingOrWrongParagraphCitation(s)')}:</span>
            <ul className="list-disc list-inside">
              {node.paragraphCitationAnnotations.map(({ awaitedParagraph/* TODO:, citedParagraph*/ }) => <li key={awaitedParagraph}>{awaitedParagraph}</li>)}
            </ul>
          </div>}

          <div>
            {node.annotations.map((annotation) =>
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
