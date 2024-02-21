import { ReactElement } from 'react';
import { GeneratedAnnotationFragment } from '../../graphql';
import { AnnotationPreviewSampleNodeDisplay, AnnotationPreviewSampleNodeDisplayProps } from './AnnotationPreviewNodeDisplay';

interface IProps extends AnnotationPreviewSampleNodeDisplayProps {
  ownAnnotations: GeneratedAnnotationFragment[];
}

export function AnnotationPreviewUserNodeDisplay({ ownAnnotations, ...otherProps }: IProps): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2">
      <AnnotationPreviewSampleNodeDisplay {...otherProps} />

      <div>{ownAnnotations.length > 0 && ownAnnotations.map(({ id, text }) => <div key={id}>{text}</div>)}</div>
    </div>
  );
}
