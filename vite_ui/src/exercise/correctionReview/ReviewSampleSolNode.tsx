import { ReactElement } from 'react';
import { NodeDisplayProps } from '../nodeDisplayProps';
import { FlatNodeText } from '../FlatNodeText';
import classNames from 'classnames';

/** @deprecated */
export function ReviewSampleSolNode({ node, ownMatches, ...otherProps }: NodeDisplayProps): ReactElement {
  return (
    <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
      <FlatNodeText isSample={true}  {...otherProps} node={node} ownMatches={ownMatches} onDragDrop={async () => void 0} />
    </div>
  );
}
