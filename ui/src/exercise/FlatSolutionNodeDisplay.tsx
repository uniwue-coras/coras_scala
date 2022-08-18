import {FlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {indentPerRow} from '../solveViews/SolutionTableCell';
import classNames from 'classnames';

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[];
  updateNodeId: (id?: number | undefined) => void;
}

interface IProps {
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  hoveredNodeId: MarkedNodeIdProps;
  selectedNodeId: MarkedNodeIdProps;
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId?: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === undefined || currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

const hoveredNodeClass = 'bg-blue-500';
const matchingHoveredNodeClass = 'bg-blue-300';

const selectedNodeClass = 'bg-red-500';
const matchingSelectedNodeClass = 'bg-red-300';

export function FlatSolutionNodeDisplay({currentNode, allNodes, depth = 0, hoveredNodeId, selectedNodeId}: IProps): JSX.Element {

  const {id, childIndex, text, applicability, subTexts} = currentNode;
  const updateHoveredNodeId = hoveredNodeId.updateNodeId;
  const updateSelectedNodeId = selectedNodeId.updateNodeId;

  const children = getFlatSolutionNodeChildren(allNodes, id);

  const isSelected = selectedNodeId.nodeId === id;

  const classes = classNames('p-2', 'rounded', 'font-bold', {
    [hoveredNodeClass]: hoveredNodeId.nodeId === id,
    [matchingHoveredNodeClass]: hoveredNodeId.matchingNodeIds.includes(id),
    [selectedNodeClass]: isSelected,
    [matchingSelectedNodeClass]: selectedNodeId.matchingNodeIds.includes(id)
  });

  return (
    <div>
      <div className={classes} onMouseEnter={() => updateHoveredNodeId(id)} onMouseLeave={() => updateHoveredNodeId()}
           onClick={() => isSelected ? updateSelectedNodeId() : updateSelectedNodeId(id)}>
        {getBullet(depth, childIndex)}. {text}
      </div>

      <div style={{marginLeft: `${indentPerRow / 2}px`}}>
        {subTexts.map((subText, index) => <p key={index}>{subText.text}</p>)}
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {children.map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} currentNode={child} allNodes={allNodes} depth={depth + 1} hoveredNodeId={hoveredNodeId}
                                   selectedNodeId={selectedNodeId}/>
        )}
      </div>
    </div>
  );
}
