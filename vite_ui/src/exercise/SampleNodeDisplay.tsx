import { ReactElement } from 'react';
import { NodeDisplayProps } from './nodeDisplayProps';
import { FlatNodeText } from './FlatNodeText';
import classNames from 'classnames';

interface IProps extends NodeDisplayProps {
  onDragDrop?: (sampleNodeId: number, userNodeId: number) => void;
}

export function SampleNodeDisplay({ node, ownMatches, index, depth, onDragDrop }: IProps): ReactElement {
  return (
    <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
      <FlatNodeText isSample={true} {...{ node, ownMatches, onDragDrop, index, depth }} />
    </div>
  );
}
