import { ReactElement } from 'react';
import { AnnotationPreviewNodeDisplayProps } from './AnnotationPreviewNodeDisplay';
import { FlatNodeText } from '../../exercise/FlatNodeText';
import classNames from 'classnames';

export function AnnotationPreviewSampleNodeDisplay({ node, ownMatches, ...props }: AnnotationPreviewNodeDisplayProps): ReactElement {
  return (
    <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
      <FlatNodeText node={node} ownMatches={ownMatches} {...props} />
    </div>
  );
}
