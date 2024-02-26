import { ReactElement } from 'react';
import { DefaultSolutionNodeMatchFragment, GeneratedAnnotationFragment } from '../../graphql';
import { AnnotationPreviewSampleNodeDisplay, AnnotationPreviewSampleNodeDisplayProps } from './AnnotationPreviewNodeDisplay';

interface IProps extends AnnotationPreviewSampleNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
}

const matchIsCertain = ({ maybeExplanation }: DefaultSolutionNodeMatchFragment): boolean => maybeExplanation === null || maybeExplanation === undefined;

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ownMatches, ...otherProps }: IProps): ReactElement {

  const isCorrect = ownAnnotations.length === 0 && ownMatches.length === 1 && matchIsCertain(ownMatches[0]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <AnnotationPreviewSampleNodeDisplay ownMatches={ownMatches} {...otherProps} />

      <div>
        {isCorrect
          ? <div className="p-2 font-extrabold text-green-500">&#x2713;</div>
          : ownAnnotations.map(({ id, text }) => <div key={id} className="p-2 rounded border-2 border-orange-500 flex flex-row">&#x2699; {text}</div>)}
      </div>
    </div>
  );
}

