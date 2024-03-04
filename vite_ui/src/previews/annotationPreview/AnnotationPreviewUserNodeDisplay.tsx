import { ReactElement, useState } from 'react';
import { DefaultSolutionNodeMatchFragment, GeneratedAnnotationFragment, SolNodeMatchExplanationFragment } from '../../graphql';
import { AnnotationPreviewSampleNodeDisplay, AnnotationPreviewSampleNodeDisplayProps } from './AnnotationPreviewNodeDisplay';
import { SolutionNodeMatchExplanation } from '../SolutionNodeMatchExplanation';

interface IProps extends AnnotationPreviewSampleNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
  rejectAnnotation: (id: number) => void;
}

const matchIsCertain = ({ maybeExplanation }: DefaultSolutionNodeMatchFragment): boolean => maybeExplanation === null || maybeExplanation === undefined;

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, rejectAnnotation, ...otherProps }: IProps): ReactElement {

  const isCorrect = ownAnnotations.length === 0 && ownMatches.length === 1 && matchIsCertain(ownMatches[0]);

  const [isMatchExamination, setIsMatchExamination] = useState(false);

  const ownCertainMatchExplanations = ownMatches
    .map(({ maybeExplanation }) => maybeExplanation)
    .filter((me): me is SolNodeMatchExplanationFragment => me !== undefined && me !== null);

  return (
    <div className="grid grid-cols-2 gap-2">
      <AnnotationPreviewSampleNodeDisplay ownMatches={ownMatches} {...otherProps} />

      <div className="flex flew-row space-x-2">
        {!isCorrect && ownMatches.length > 0 && <button className="px-4 py-2 font-bold rounded border border-slate-500" onClick={() => setIsMatchExamination((val) => !val)}>
          {isMatchExamination ? '!' : '?'}
        </button>}

        <div className="flex-grow">
          {isMatchExamination
            ? (
              <>
                {ownCertainMatchExplanations.map((explanation, index) => <SolutionNodeMatchExplanation key={index} explanation={explanation} />)}
              </>
            ) : (
              <div className="p-2">
                {isCorrect
                  ? <div className="font-extrabold text-green-500">&#x2713;</div>
                  : ownAnnotations.map(({ id, text }) =>
                    <div key={id} className="mb-2 p-2 rounded border-2 border-orange-500 flex flex-row">
                      <div className="flex-grow">&#x2699; {text}</div>
                      <button onClick={() => rejectAnnotation(id)}>X</button>
                    </div>)}
              </div>
            )}
        </div>

      </div>
    </div>
  );
}

