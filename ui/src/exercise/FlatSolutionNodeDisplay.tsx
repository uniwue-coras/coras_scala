import {FlatSolutionNodeFragment} from '../graphql';
import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, CurrentSelection, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {CSSProperties} from 'react';
import {ErrorType} from './CorrectionColumn';

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
  currentSelection?: CurrentSelection;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  showSubTexts: boolean;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

const getMarkedSubText = (currentNodeId: number, subText: string, currentSelection: CurrentSelection | undefined): JSX.Element | undefined => {
  if (currentSelection === undefined || currentSelection._type !== 'IAnnotation' || currentSelection.nodeId !== currentNodeId) {
    return undefined;
  }

  const {startOffset, endOffset} = currentSelection;

  const bgColor: string = {
    [ErrorType.Missing]: 'bg-amber-500',
    [ErrorType.Wrong]: 'bg-red-500'
  }[currentSelection.errorType];

  return (
    <div>
      <span>{subText.substring(0, startOffset)}</span>
      <span className={bgColor}>{subText.substring(startOffset, endOffset)}</span>
      <span>{subText.substring(endOffset)}</span>
    </div>
  );
};

export function FlatSolutionNodeDisplay({
  side,
  matches,
  currentNode,
  currentSelection,
  allNodes,
  depth = 0,
  showSubTexts,
  selectedNodeId,
  onNodeClick,
  dragProps
}: IProps): JSX.Element {

  const {id, subText} = currentNode;

  const ownMatches = side === SideSelector.Sample
    ? matches.filter(({sampleValue}) => id === sampleValue)
    : matches.filter(({userValue}) => id === userValue);

  const mainMatch: ColoredMatch | undefined = ownMatches.length === 1 ? ownMatches[0] : undefined;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, id);

  const markedSubText = subText !== undefined && subText !== null ? getMarkedSubText(id, subText, currentSelection) : undefined;

  const subTextStyle: CSSProperties = {marginLeft: `${indentPerRow / 2}px`, whiteSpace: 'pre-wrap'};

  return (
    <div>
      <div className="my-2 p-2" onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(id)}>
        <FlatNodeText side={side} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps} mainMatch={mainMatch}/>
      </div>

      {showSubTexts && subText && <div id={`node_${side}_${id}`} style={subTextStyle}>{markedSubText || subText}</div>}

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {getFlatSolutionNodeChildren(allNodes, id).map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} matches={matches} side={side} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                   showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} dragProps={dragProps}
                                   currentSelection={currentSelection}/>
        )}
      </div>
    </div>
  );
}
