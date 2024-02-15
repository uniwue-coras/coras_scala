import { SolutionNodeFragment, SolutionNodeMatchFragment } from '../graphql';
import { ReactElement } from 'react';
import { SideSelector } from './CorrectSolutionView';
import { MarkedNodeIdProps } from './CorrectionSampleSolNode';
import { MatchEditData } from './matchEditData';
import { getFlatSolutionNodeChildren } from '../flatNode';

type INode = SolutionNodeFragment;

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

export interface NodeDisplayProps<N extends INode = INode> {
  matches: SolutionNodeMatchFragment[];
  currentNode: N;
  allNodes: N[];
  depth: number;
}

export interface CorrectionNodeDisplayProps<N extends INode = INode> extends NodeDisplayProps<N> {
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
  matchEditData: MatchEditData | undefined;
}




export interface IProps<
  Node extends INode = INode,
  ChildProps extends NodeDisplayProps<Node> = NodeDisplayProps<Node>
> {
  otherProps: ChildProps;
  children: (props: ChildProps) => ReactElement;
  adjustLoopedProps?: (currentNode: Node, p: Omit<ChildProps, 'currentNode' | 'depth' | 'allNodes'>) => Omit<ChildProps, 'currentNode' | 'depth' | 'allNodes'>;
}

export const indentPerRow = 40;

export function BasicNodeDisplay<Node extends INode = INode, ChildProps extends NodeDisplayProps<Node> = NodeDisplayProps<Node>>({
  children,
  otherProps,
  adjustLoopedProps
}: IProps<Node, ChildProps>): ReactElement {

  const { currentNode, allNodes, depth = 0, ...initialLoopedProps } = otherProps;

  const nodeChildren = getFlatSolutionNodeChildren(allNodes, currentNode.id);

  const loopedProps = adjustLoopedProps !== undefined
    ? adjustLoopedProps(currentNode, initialLoopedProps)
    : initialLoopedProps;

  return (
    <>
      {children(otherProps)}

      <div style={{ marginLeft: `${indentPerRow}px` }}>
        {nodeChildren.map((childNode) =>
          <BasicNodeDisplay key={childNode.childIndex} otherProps={{ currentNode: childNode, allNodes, depth: depth + 1, ...loopedProps } as ChildProps}>
            {children}
          </BasicNodeDisplay>
        )}
      </div>

    </>
  );
}
