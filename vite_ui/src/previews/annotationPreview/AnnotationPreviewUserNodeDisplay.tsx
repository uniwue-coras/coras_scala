import { ReactElement, useState } from 'react';
import { GeneratedAnnotationFragment, MatchingReviewSolNodeFragment, ParagraphMatchingResultFragment } from '../../graphql';
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

function analyseParagraphCitationCorrectness(node: MatchingReviewSolNodeFragment, paragraphCitations: ParagraphMatchingResultFragment[]): Correctness {
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

function isDefined<T>(t: T | undefined | null): t is T {
  return t !== undefined && t !== null;
}

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, node, rejectAnnotation, ...otherProps }: IProps): ReactElement {

  const paragraphMatchingResults = ownMatches.flatMap(({ paragraphMatchingResult }) => isDefined(paragraphMatchingResult) ? [paragraphMatchingResult] : []);

  const calculatedMatchCorrectness = analyseMatchingCorrectness(ownMatches/*, ownAnnotations*/);

  const [matchCorrectness, setMatchCorrectness] = useState<Correctness | undefined>(undefined);
  const [paragraphCitationCorrectness, setParagraphCitationCorrectness] = useState(analyseParagraphCitationCorrectness(node, paragraphMatchingResults));
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
