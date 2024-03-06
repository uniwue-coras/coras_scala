import { ReactElement, useState } from 'react';
import { DefaultSolutionNodeMatchFragment, GeneratedAnnotationFragment, ParagraphMatchingResultFragment, SolNodeMatchExplanationFragment, SolutionNodeMatchFragment } from './graphql';
import { AnnotationPreviewSampleNodeDisplay, AnnotationPreviewSampleNodeDisplayProps } from './previews/annotationPreview/AnnotationPreviewNodeDisplay';
import { GearIcon } from './icons';
import { CorrectnessSignal } from './previews/annotationPreview/CorrectnessSignal';
import { Correctness, nextCorrectness as nextCorrectness } from './correctness';

interface IProps extends AnnotationPreviewSampleNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
  rejectAnnotation: (id: number) => void;
}

const matchIsCertain = ({ maybeExplanation }: DefaultSolutionNodeMatchFragment): boolean => maybeExplanation === null || maybeExplanation === undefined;

function analyseMatchingCorrectness(ownMatches: SolutionNodeMatchFragment[], ownAnnotations: GeneratedAnnotationFragment[]): Correctness {
  if (ownMatches.length === 0) { // Not matched...
    return Correctness.Wrong;
  }

  if (ownAnnotations.length > 0) { // There are annotations...
    return Correctness.Partially;
  }

  return ownMatches.length === 1 && matchIsCertain(ownMatches[0]) ? Correctness.Correct : Correctness.Partially;
}

function analyseParagraphCitationCorrectness(paragraphCitations: ParagraphMatchingResultFragment[]): Correctness {
  if (paragraphCitations.length === 0) {
    return Correctness.Unspecified;
  }

  // wrong if sampleNotMatched !empty 

  //  const allCorrect = paragraphCitations.every(({ matches, notMatchedSample, notMatchedUser }) => false);

  return Correctness.Partially;
}

function analyseSubTextCorrectness(): Correctness {
  return Correctness.Unspecified;
}

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, rejectAnnotation, ...otherProps }: IProps): ReactElement {

  const ownUncertainMatchExplanations = ownMatches
    .map(({ maybeExplanation }) => maybeExplanation)
    .filter((me): me is SolNodeMatchExplanationFragment => me !== undefined && me !== null);

  const paragraphMatchingResults = ownUncertainMatchExplanations
    .map(({ maybeParagraphMatchingResult }) => maybeParagraphMatchingResult)
    .filter((pmr): pmr is ParagraphMatchingResultFragment => pmr !== undefined && pmr !== null);

  const [matchCorrectness, setMatchCorrectness] = useState(analyseMatchingCorrectness(ownMatches, ownAnnotations));
  const [paragraphCitationCorrectness, setParagraphCitationCorrectness] = useState(analyseParagraphCitationCorrectness(paragraphMatchingResults));
  const [explanationCorrectness, setExplanationCorrectness] = useState(analyseSubTextCorrectness());

  return (
    <div className="grid grid-cols-2 gap-2">
      <AnnotationPreviewSampleNodeDisplay ownMatches={ownMatches} {...otherProps} />

      <div className="flex flew-row items-start space-x-2">
        <CorrectnessSignal letter="H" correctness={matchCorrectness} onClick={() => setMatchCorrectness(nextCorrectness)} />
        <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={() => setParagraphCitationCorrectness(nextCorrectness)} />
        <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={() => setExplanationCorrectness(nextCorrectness)} />

        <div className="flex-grow">
          {ownAnnotations.map(({ id, text }) =>
            <div key={id} className="mb-2 p-2 rounded border-2 border-orange-500 flex flex-row space-x-1 items-start">
              <div><GearIcon /></div>
              <div className="flex-grow">{text}</div>
              <button onClick={() => rejectAnnotation(id)}>X</button>
            </div>)}
        </div>
      </div>
    </div>

  );
}
