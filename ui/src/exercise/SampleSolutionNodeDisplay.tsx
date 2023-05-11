import {FlatNodeText} from './FlatNodeText';
import {JSX} from 'react';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {getFlatSolutionNodeChildren} from './UserSolutionNodeDisplay';
import {NodeDisplayProps} from './nodeDisplayProps';

const indentPerRow = 40;

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

interface IProps extends NodeDisplayProps {
  parentMatched?: boolean;
}

export function SampleSolutionNodeDisplay({
  matches,
  currentNode,
  allNodes,
  depth = 0,
  selectedNodeId,
  onNodeClick,
  dragProps,
  parentMatched = true,
  matchEditData
}: IProps): JSX.Element {

  const mainMatch: ColoredMatch | undefined = matches.find(({sampleValue}) => currentNode.id === sampleValue);

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const isMatched = mainMatch !== undefined;

  const className = parentMatched && !isMatched && !currentNode.isSubText
    ? 'my-1 border border-2 border-red-600'
    : undefined;

  return (
    <div className={className}>
      <FlatNodeText side={SideSelector.Sample} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
        mainMatchColor={mainMatch?.color} onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}
        currentEditedAnnotation={undefined} focusedAnnotation={undefined}/>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {getFlatSolutionNodeChildren(allNodes, currentNode.id).map((child) =>
          <SampleSolutionNodeDisplay key={child.childIndex} matches={matches} currentNode={child} allNodes={allNodes} depth={depth + 1}
            selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} dragProps={dragProps} parentMatched={isMatched} matchEditData={matchEditData}/>
        )}
      </div>
    </div>
  );
}
