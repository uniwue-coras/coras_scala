import {IFlatSolutionNodeFragment} from '../graphql';
import {JSX} from 'react';
import {DragStatusProps, getFlatSolutionNodeChildren} from './UserSolutionNodeDisplay';
import {ColoredMatch} from './CorrectSolutionView';
import {MarkedNodeIdProps} from './SampleSolutionNodeDisplay';
import {MatchEditData} from './MatchEdit';

type INode = IFlatSolutionNodeFragment;

export interface NodeDisplayProps<N extends INode = INode> {
  matches: ColoredMatch[];
  currentNode: N;
  allNodes: N[];
  depth: number;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
  matchEditData: MatchEditData | undefined;
}

export interface IProps<Node extends INode = INode> extends NodeDisplayProps<Node> {
  children: (props: NodeDisplayProps<Node>) => JSX.Element;
}

export const indentPerRow = 40;

export function BasicNodeDisplay<Node extends INode = INode>({children, ...props}: IProps<Node>): JSX.Element {

  const {
    currentNode,
    allNodes,
    dragProps,
    onNodeClick,
    selectedNodeId,
    matches,
    matchEditData,
    depth = 0,
  } = props;

  const nodeChildren = getFlatSolutionNodeChildren(allNodes, currentNode.id);

  return (
    <>
      {children(props)}

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {nodeChildren.map((childNode) =>
          <BasicNodeDisplay key={childNode.childIndex} currentNode={childNode} allNodes={allNodes} depth={depth + 1} selectedNodeId={selectedNodeId}
            onNodeClick={onNodeClick} dragProps={dragProps} matches={matches} matchEditData={matchEditData}>
            {children}
          </BasicNodeDisplay>
        )}
      </div>

    </>
  );
}
