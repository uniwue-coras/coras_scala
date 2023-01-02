import {FlatSolutionNodeFragment} from '../graphql';
import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, SideSelector} from './NewCorrectSolutionContainer';
import {getSelectionState, SelectionState} from './selectionState';

export const indentPerRow = 40;

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
  side: SideSelector;
  matches: ColoredMatch[];
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  showSubTexts: boolean;
  selectedNodeId: MarkedNodeIdProps;
  triggerNodeSelect: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}


export function FlatSolutionNodeDisplay({
  side,
  matches,
  currentNode,
  allNodes,
  depth = 0,
  showSubTexts,
  selectedNodeId,
  triggerNodeSelect,
  dragProps
}: IProps): JSX.Element {

  const {id, subTexts} = currentNode;

  const ownMatches = side === SideSelector.Sample
    ? matches.filter(({sampleValue}) => id === sampleValue)
    : matches.filter(({userValue}) => id === userValue);

  const mainMatch: ColoredMatch | undefined = ownMatches.length === 1 ? ownMatches[0] : undefined;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, id);

  /** @deprecated */
  // const isMatchingSelected = selectedNodeId?.matchingNodeIds.includes(id);


  return (
    <div>
      <div className="my-2 p-2" onClick={() => selectionState === SelectionState.This ? triggerNodeSelect() : triggerNodeSelect(id)}>
        <FlatNodeText side={side} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps} mainMatch={mainMatch}/>
      </div>

      {showSubTexts &&
        <div style={{marginLeft: `${indentPerRow / 2}px`, whiteSpace: 'pre-wrap'}}>
          {subTexts.map(({text}) => text).join('\n')}
        </div>
      }

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {getFlatSolutionNodeChildren(allNodes, id).map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} matches={matches} side={side} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                   showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} triggerNodeSelect={triggerNodeSelect} dragProps={dragProps}/>
        )}
      </div>
    </div>
  );
}
