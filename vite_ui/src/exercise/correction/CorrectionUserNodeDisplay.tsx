import { FlatNodeText } from '../FlatNodeText';
import { SideSelector } from '../SideSelector';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from '../AnnotationView';
import { Correctness, FlatUserSolutionNodeFragment, ParagraphMatchingResultFragment } from '../../graphql';
import { CurrentSelection } from '../currentSelection';
import { MatchEdit } from '../MatchEdit';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import { isDefined } from '../../funcs';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { minimalCorrectness, nextCorrectness } from '../../correctness';
import { checkMatchingResultCorrectness } from '../../matchingResult';

interface IProps extends CorrectionNodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
  onUpdateCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => void;
}

function analyseParagraphCitationCorrectness(node: FlatUserSolutionNodeFragment, paragraphCitations: ParagraphMatchingResultFragment[]): Correctness {
  // FIXME: paragraphs from subTexts!
  if (paragraphCitations.length > 0) {
    console.info(node.id + ' :: ' + node.text.substring(0, 20)/* + '\n' + JSON.stringify(paragraphCitations)*/);
  }

  return paragraphCitations.length === 0
    ? Correctness.Unspecified
    : minimalCorrectness(paragraphCitations.map(checkMatchingResultCorrectness));
}

function analyseSubTextCorrectness(): Correctness {
  // TODO!
  return Correctness.Unspecified;
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
  ...otherProps
}: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const mainMatch = ownMatches.length > 0 ? ownMatches[0] : undefined;

  // TODO: make available for every match!
  const setMatchCorrectness = async (newCorrectness: Correctness) => isDefined(mainMatch)
    ? onUpdateCorrectness(mainMatch!.sampleNodeId, node.id, newCorrectness)
    : () => void 0;

  // const [/* matchCorrectness */, setMatchCorrectness] = useState<Correctness | undefined>(undefined);
  const [paragraphCitationCorrectness, setParagraphCitationCorrectness] = useState(analyseParagraphCitationCorrectness(node, [] /* TODO: paragraphMatchingResults */));
  const [explanationCorrectness, setExplanationCorrectness] = useState(analyseSubTextCorrectness());

  const mainMatchCorrectness: Correctness = isDefined(mainMatch) ? mainMatch.correctness : Correctness.Wrong;

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
      <FlatNodeText isSample={false} {...otherProps} node={node} ownMatches={ownMatches} focusedAnnotation={focusedAnn} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div className="flex flew-row items-start space-x-2">
        {!node.isSubText && <>
          <CorrectnessSignal letter="&#x2BB1;" correctness={mainMatchCorrectness} onClick={() => setMatchCorrectness(nextCorrectness(mainMatchCorrectness))} />
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
