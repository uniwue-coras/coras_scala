import { FlatNodeText } from '../FlatNodeText';
import { ReactElement } from 'react';
import { SideSelector } from '../SideSelector';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import { MatchEdit } from '../MatchEdit';
import classNames from 'classnames';

export function CorrectionSampleNodeDisplay({ node, ownMatches, matchEditData, onDragDrop: onDrop, ...otherProps }: CorrectionNodeDisplayProps): ReactElement {

  const matchEditDataForNode = matchEditData !== undefined && matchEditData.markedNodeSide === SideSelector.Sample && matchEditData.markedNode.id === node.id
    ? matchEditData
    : undefined;

  if (matchEditDataForNode) {
    console.info(matchEditDataForNode);
  }

  return (
    <>
      <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
        <FlatNodeText isSample={true} {...otherProps} node={node} ownMatches={ownMatches} onDragDrop={onDrop} />
      </div>

      {/* FIXME: edit matches... */}
      {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
    </>
  );
}

