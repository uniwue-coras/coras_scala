import {FlatSolutionNodeFragment} from '../graphql';
import {getBullet} from '../solutionInput/bulletTypes';
import {indentPerRow} from '../solveViews/SolutionTableCell';
import classNames from 'classnames';

interface IProps {
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  currentHoveredNodeId: number | undefined;
  updateHoveredNodeId: (id?: number) => void;
  matchingNodeIds: number[];
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId?: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === undefined || currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

export function FlatSolutionNodeDisplay({currentNode, allNodes, depth = 0, currentHoveredNodeId, updateHoveredNodeId, matchingNodeIds}: IProps): JSX.Element {

  const {id, childIndex, text, applicability, subTexts} = currentNode;

  const children = getFlatSolutionNodeChildren(allNodes, id);

  const classes = classNames('p-2', 'rounded', 'font-bold', currentHoveredNodeId === id ? ['bg-blue-500'] : [], matchingNodeIds.includes(id) ? ['bg-blue-300'] : []);

  return (
    <div>
      <div className={classes} onMouseEnter={() => updateHoveredNodeId(id)} onMouseLeave={() => updateHoveredNodeId()}>
        {getBullet(depth, childIndex)}. {text}
      </div>

      <div style={{marginLeft: `${indentPerRow / 2}px`}}>
        {subTexts.map((subText, index) => <p key={index}>{subText.text}</p>)}
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {children.map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} currentNode={child} allNodes={allNodes} depth={depth + 1} currentHoveredNodeId={currentHoveredNodeId}
                                   updateHoveredNodeId={updateHoveredNodeId} matchingNodeIds={matchingNodeIds}/>)}
      </div>
    </div>
  );
}
