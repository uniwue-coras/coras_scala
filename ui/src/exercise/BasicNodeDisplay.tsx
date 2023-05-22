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

export interface IProps<Node extends INode = INode> {
  otherProps: NodeDisplayProps<Node>;
  children: (props: NodeDisplayProps<Node>) => JSX.Element;
}

export const indentPerRow = 40;

export function BasicNodeDisplay<Node extends INode = INode>({children, otherProps}: IProps<Node>): JSX.Element {

  const {
    currentNode,
    depth = 0,
    ...loopedProps
  } = otherProps;

  const nodeChildren = getFlatSolutionNodeChildren(otherProps.allNodes, otherProps.currentNode.id);

  return (
    <>
      {children(otherProps)}

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {nodeChildren.map((childNode) =>
          <BasicNodeDisplay key={childNode.childIndex} otherProps={{currentNode: childNode, depth: depth + 1, ...loopedProps}}/* currentNode={childNode} depth={depth + 1} {...loopedProps}*/>
            {children}
          </BasicNodeDisplay>
        )}
      </div>

    </>
  );
}
