import { FlatNodeText } from '../FlatNodeText';
import { ReactElement } from 'react';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import classNames from 'classnames';

export function CorrectionSampleNodeDisplay({ node, ownMatches, ...otherProps }: CorrectionNodeDisplayProps): ReactElement {
  return (
    <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
      <FlatNodeText isSample={true} {...{ node, ownMatches }} {...otherProps} />
    </div>
  );
}

