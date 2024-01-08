import { FlatNodeText } from './FlatNodeText';
import { ReactElement } from 'react';
import { SideSelector } from './CorrectSolutionView';
import { getSelectionState } from './selectionState';
import { allMatchColors } from '../allMatchColors';
import { MatchEdit } from './MatchEdit';
import { CorrectionNodeTextDisplayProps } from './CorrectionNodeTextDisplayProps';
import classNames from 'classnames';

export function SampleNodeTextDisplay({ node, depth, ownMatch, selectedNodeId, onClick, dragProps, matches, matchEditData }: CorrectionNodeTextDisplayProps): ReactElement {

  const parentMatched = node.parentId && matches.some(({ sampleNodeId }) => sampleNodeId === node.parentId);

  const mainMatchColor = ownMatch !== undefined ? allMatchColors[ownMatch.sampleNodeId] : undefined;

  const matchEditDataForNode = matchEditData !== undefined && matchEditData.markedNodeSide === SideSelector.Sample && matchEditData.markedNode.id === node.id
    ? matchEditData
    : undefined;

  return (
    <>
      <div className={classNames({ 'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined })}>
        <FlatNodeText side={SideSelector.Sample} selectionState={getSelectionState(selectedNodeId, node.id)}
          {...{ node, dragProps, mainMatchColor, depth, onClick }} focusedAnnotation={undefined} currentEditedAnnotation={undefined} />
      </div>

      {/* FIXME: edit matches... */}
      {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
    </>
  );
}


