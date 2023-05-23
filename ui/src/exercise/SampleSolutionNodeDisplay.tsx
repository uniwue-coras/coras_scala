import {FlatNodeText} from './FlatNodeText';
import {JSX} from 'react';
import {SideSelector} from './CorrectSolutionView';
import {getSelectionState} from './selectionState';
import {IColor} from '../colors';
import {BasicNodeDisplay, CorrectionNodeDisplayProps} from './BasicNodeDisplay';
import classNames from 'classnames';
import {IFlatSolutionNodeFragment} from '../graphql';

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

interface IProps extends CorrectionNodeDisplayProps {
  parentMatched?: boolean;
}

function TextDisplay({currentNode, allNodes, selectedNodeId, onNodeClick, dragProps, matches, depth, matchEditData, parentMatched}: IProps): JSX.Element {

  const mainMatchColor: IColor | undefined = matches.find(({sampleValue}) => currentNode.id === sampleValue)?.color;

  return (
    <div className={classNames({'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined && !currentNode.isSubText})}>
      <FlatNodeText side={SideSelector.Sample} selectionState={getSelectionState(selectedNodeId, currentNode.id)} node={currentNode} dragProps={dragProps}
        mainMatchColor={mainMatchColor} depth={depth} onClick={onNodeClick} focusedAnnotation={undefined} currentEditedAnnotation={undefined}/>
    </div>
  );
}

type LoopedProps = Omit<IProps, 'currentNode' | 'depth' | 'allNodes'>;

const adjustLoopedProps = (currentNode: IFlatSolutionNodeFragment, {matches, ...data}: LoopedProps): LoopedProps => {
  return {...data, matches, parentMatched: matches.some(({sampleValue}) => sampleValue === currentNode.id)};
};

export function SampleSolutionNodeDisplay(props: IProps): JSX.Element {
  return (
    <BasicNodeDisplay otherProps={props} adjustLoopedProps={adjustLoopedProps}>
      {(textProps) => <TextDisplay {...textProps}/>}
    </BasicNodeDisplay>
  );
}
