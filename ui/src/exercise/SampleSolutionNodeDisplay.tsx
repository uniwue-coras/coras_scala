import {FlatSolutionNodeFragment} from '../graphql';
import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {IColor} from '../colors';
import {getFlatSolutionNodeChildren} from './UserSolutionNodeDisplay';

const indentPerRow = 40;

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side?: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => void;
}

interface IProps {
  matches: ColoredMatch[];
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  showSubTexts: boolean;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
}

export function SampleSolutionNodeDisplay({
  matches,
  currentNode,
  allNodes,
  depth = 0,
  showSubTexts,
  selectedNodeId,
  onNodeClick,
  dragProps
}: IProps): JSX.Element {

  const mainMatchColor: IColor | undefined = matches.find(({sampleValue}) => currentNode.id === sampleValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  return (
    <div>
      <div className="my-2 p-2" onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}>
        <FlatNodeText side={SideSelector.Sample} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
                      mainMatchColor={mainMatchColor}/>
      </div>

      {showSubTexts && currentNode.subText &&
        <div id={`node_${SideSelector.Sample}_${currentNode.id}`} style={{marginLeft: `${indentPerRow}px`, whiteSpace: 'pre-wrap'}}>{currentNode.subText}</div>}

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {getFlatSolutionNodeChildren(allNodes, currentNode.id).map((child) =>
          <SampleSolutionNodeDisplay key={child.childIndex} matches={matches} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                     showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} dragProps={dragProps}/>
        )}
      </div>
    </div>
  );
}
