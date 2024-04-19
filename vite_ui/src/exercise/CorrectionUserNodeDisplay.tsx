import { FlatNodeText } from './FlatNodeText';
import { SideSelector } from './SideSelector';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from './AnnotationView';
import { FlatUserSolutionNodeFragment } from '../graphql';
import { CurrentSelection } from './currentSelection';
import { MatchEdit } from './MatchEdit';
import { CorrectionNodeDisplayProps } from './nodeDisplayProps';
import { isDefined } from '../funcs';
import { CorrectnessSignal } from './CorrectnessSignal';
import { Correctness, nextCorrectness } from '../correctness';
import { analyseMatchingCorrectness } from '../correctionAnalysis';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

export function CorrectionUserNodeDisplay({
  node,
  matchEditData,
  currentSelection,
  annotationEditingProps,
  onRemoveAnnotation,
  onEditAnnotation,
  ...otherProps
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();
  const [matchCorrectness, setMatchCorrectness] = useState<Correctness | undefined>(undefined);
  const [paragraphCitationCorrectness, setParagraphCitationCorrectness] = useState(Correctness.Wrong/*analyseParagraphCitationCorrectness(node, paragraphMatchingResults)*/);
  const [explanationCorrectness, setExplanationCorrectness] = useState(Correctness.Wrong/*analyseSubTextCorrectness()*/);

  const calculatedMatchCorrectness = analyseMatchingCorrectness(otherProps.ownMatches/*, ownAnnotations*/);

  const focusedAnn = focusedAnnotationId !== undefined
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
      <FlatNodeText isSample={false} {...otherProps} node={node} focusedAnnotation={focusedAnn} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div className="flex flew-row items-start space-x-2">
        {!node.isSubText && <>
          <CorrectnessSignal letter="&#x2BB1;" correctness={matchCorrectness || calculatedMatchCorrectness} onClick={() => setMatchCorrectness(nextCorrectness)} />
          <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={() => setParagraphCitationCorrectness(nextCorrectness)} />
          <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={() => setExplanationCorrectness(nextCorrectness)} />
        </>}

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
