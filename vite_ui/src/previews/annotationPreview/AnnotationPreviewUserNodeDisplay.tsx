import { ReactElement, useState } from 'react';
import { GeneratedAnnotationFragment, ParagraphMatchingResultFragment, SolNodeMatchExplanationFragment } from '../../graphql';
import { AnnotationPreviewNodeDisplay, AnnotationPreviewNodeDisplayProps } from './AnnotationPreviewNodeDisplay';
import { GearIcon } from '../../icons';
import { CorrectnessSignal } from './CorrectnessSignal';
import { Correctness, minimalCorrectness, nextCorrectness } from '../../correctness';
import { analyseMatchingCorrectness } from '../../correctionAnalysis';
import { checkMatchingResultCorrectness } from '../../matchingResult';

interface IProps extends AnnotationPreviewNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
  rejectAnnotation: (id: number) => void;
}

function analyseParagraphCitationCorrectness(paragraphCitations: ParagraphMatchingResultFragment[]): Correctness {
  return paragraphCitations.length === 0
    ? Correctness.Unspecified
    : minimalCorrectness(paragraphCitations.map(checkMatchingResultCorrectness));
}

function analyseSubTextCorrectness(): Correctness {
  // TODO!
  return Correctness.Unspecified;
}

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, node, rejectAnnotation, ...otherProps }: IProps): ReactElement {

  const ownUncertainMatchExplanations = ownMatches
    .map(({ maybeExplanation }) => maybeExplanation)
    .filter((me): me is SolNodeMatchExplanationFragment => me !== undefined && me !== null);

  const paragraphMatchingResults = ownUncertainMatchExplanations
    .map(({ maybeParagraphMatchingResult }) => maybeParagraphMatchingResult)
    .filter((pmr): pmr is ParagraphMatchingResultFragment => pmr !== undefined && pmr !== null);

  const calculatedMatchCorrectness = analyseMatchingCorrectness(node.id, ownMatches/*, ownAnnotations*/);

  const [matchCorrectness, setMatchCorrectness] = useState<Correctness | undefined>(undefined);
  const [paragraphCitationCorrectness, setParagraphCitationCorrectness] = useState(analyseParagraphCitationCorrectness(paragraphMatchingResults));
  const [explanationCorrectness, setExplanationCorrectness] = useState(analyseSubTextCorrectness());

  return (
    <div className="grid grid-cols-2 gap-2">
      <AnnotationPreviewNodeDisplay ownMatches={ownMatches} node={node} {...otherProps} />

      <div className="flex flew-row items-start space-x-2">

        {!node.isSubText && <>
          <CorrectnessSignal letter="&#x2BB1;" correctness={matchCorrectness || calculatedMatchCorrectness} onClick={() => setMatchCorrectness(nextCorrectness)} />
          <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={() => setParagraphCitationCorrectness(nextCorrectness)} />
          <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={() => setExplanationCorrectness(nextCorrectness)} />
        </>}

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
