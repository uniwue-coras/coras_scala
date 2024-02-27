import { ReactElement, useState } from 'react';
import { DefaultSolutionNodeMatchFragment, GeneratedAnnotationFragment } from '../../graphql';
import { AnnotationPreviewSampleNodeDisplay, AnnotationPreviewSampleNodeDisplayProps } from './AnnotationPreviewNodeDisplay';
import { SolNodeMatchExplanation } from '../matchingReview/MatchExplanation';

interface IProps extends AnnotationPreviewSampleNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
}

const matchIsCertain = ({ maybeExplanation }: DefaultSolutionNodeMatchFragment): boolean => maybeExplanation === null || maybeExplanation === undefined;

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, ...otherProps }: IProps): ReactElement {

  const isCorrect = ownAnnotations.length === 0 && ownMatches.length === 1 && matchIsCertain(ownMatches[0]);

  const [isMatchExamination, setIsMatchExamination] = useState(false);

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
              <div>
                {ownMatches.map(({ maybeExplanation }, index) => maybeExplanation
                  ? <SolNodeMatchExplanation key={index} explanation={maybeExplanation} onMouseEnter={() => void 0} onMouseLeave={() => void 0} />
                  : <div />)}
              </div>
            )
            : (
              <div className="p-2">
                {isCorrect
                  ? <div className="font-extrabold text-green-500">&#x2713;</div>
                  : ownAnnotations.map(({ id, text }) => <div key={id} className="p-2 rounded border-2 border-orange-500 flex flex-row">&#x2699; {text}</div>)}
              </div>
            )}
        </div>

      </div>
    </div>
  );
}

