import {IFlatSolutionNodeFragment} from '../graphql';
import {JSX} from 'react';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';
import {MarkedNodeIdProps} from './SampleSolutionNodeDisplay';
import {MatchEditData} from './MatchEdit';

type INode = IFlatSolutionNodeFragment;

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

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


export function getFlatSolutionNodeChildren<T extends IFlatSolutionNodeFragment>(allNodes: T[], currentId: number | null): T[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}


export interface IProps<
  Node extends INode = INode,
  ChildProps extends NodeDisplayProps<Node> = NodeDisplayProps<Node>
> {
  otherProps: ChildProps;
  children: (props: ChildProps) => JSX.Element;
}

export const indentPerRow = 40;

export function BasicNodeDisplay<Node extends INode = INode, ChildProps extends NodeDisplayProps<Node> = NodeDisplayProps<Node>>({
  children,
  otherProps
}: IProps<Node, ChildProps>): JSX.Element {

  const {currentNode, allNodes, depth = 0, ...loopedProps} = otherProps;

  const nodeChildren = getFlatSolutionNodeChildren(allNodes, currentNode.id);

  return (
    <>
      {children(otherProps)}

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {nodeChildren.map((childNode) =>
          <BasicNodeDisplay key={childNode.childIndex} otherProps={{currentNode: childNode, allNodes, depth: depth + 1, ...loopedProps} as ChildProps}>
            {children}
          </BasicNodeDisplay>
        )}
      </div>

    </>
  );
}
