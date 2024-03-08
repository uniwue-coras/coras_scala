import { ReactElement } from 'react';
import { AnnotationPreviewNodeDisplay, AnnotationPreviewNodeDisplayProps } from './AnnotationPreviewNodeDisplay';

export function AnnotationPreviewSampleNodeDisplay({ node, ownMatches, ...props }: AnnotationPreviewNodeDisplayProps): ReactElement {

  const className = !node.isSubText && ownMatches.length === 0
    ? 'p-2 rounded border-2 border-red-600 text-red-600'
    : undefined;

  return (
    <div className={className}>
      <AnnotationPreviewNodeDisplay node={node} ownMatches={ownMatches} {...props} />
    </div>
  );
}
