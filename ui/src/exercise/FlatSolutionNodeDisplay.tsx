import {FlatSolutionNodeFragment} from '../graphql';
import {MouseEvent} from 'react';
import {indentPerRow} from '../solveViews/SolutionTableCell';
import {FlatNodeText} from './FlatNodeText';
import classNames from 'classnames';
import {SideSelector} from './NewCorrectSolutionContainer';

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[];
  updateNodeId: (id?: number | undefined) => void;
}

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side?: SideSelector | undefined) => void;
}

interface IProps {
  side: SideSelector;
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  hoveredNodeId: MarkedNodeIdProps;
  selectedNodeId: MarkedNodeIdProps;
  dragProps: DragStatusProps;
  clearMatch: (clickedNodeId: number) => void;
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId?: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === undefined || currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

const hoveredNodeClass = 'bg-blue-500';
const matchingHoveredNodeClass = 'bg-blue-400';

const selectedNodeClass = 'bg-red-500';
const matchingSelectedNodeClass = 'bg-red-400';

export function FlatSolutionNodeDisplay({side, currentNode, allNodes, depth = 0, hoveredNodeId, selectedNodeId, dragProps, clearMatch}: IProps): JSX.Element {

  const {id} = currentNode;
  const updateHoveredNodeId = hoveredNodeId.updateNodeId;
  const updateSelectedNodeId = selectedNodeId.updateNodeId;

  const children = getFlatSolutionNodeChildren(allNodes, id);

  const isSelected = selectedNodeId.nodeId === id;
  const isMatchingSelected = selectedNodeId.matchingNodeIds.includes(id);

  const classes = classNames('p-2', 'rounded', 'font-bold', {
    [hoveredNodeClass]: hoveredNodeId.nodeId === id,
    [matchingHoveredNodeClass]: hoveredNodeId.matchingNodeIds.includes(id),
    [selectedNodeClass]: isSelected,
    [matchingSelectedNodeClass]: isMatchingSelected
  });

  function onClearClick(event: MouseEvent): void {
    event.stopPropagation();
    clearMatch(id);
  }

  return (
    <div>
      <div className={classes} onMouseEnter={() => updateHoveredNodeId(id)} onMouseLeave={() => updateHoveredNodeId()}
           onClick={() => isSelected ? updateSelectedNodeId() : updateSelectedNodeId(id)}>
        <FlatNodeText side={side} depth={depth} node={currentNode} dragProps={dragProps}/>
        {isMatchingSelected && <span className="float-right" onClick={onClearClick}>X</span>}
      </div>

      <div style={{marginLeft: `${indentPerRow / 2}px`}}>
        {currentNode.subTexts.map((subText, index) => <p key={index}>{subText.text}</p>)}
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {children.map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} side={side} currentNode={child} allNodes={allNodes} depth={depth + 1} hoveredNodeId={hoveredNodeId}
                                   selectedNodeId={selectedNodeId} dragProps={dragProps} clearMatch={clearMatch}/>
        )}
      </div>
    </div>
  );
}
