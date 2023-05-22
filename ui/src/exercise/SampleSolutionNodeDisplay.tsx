import {FlatNodeText} from './FlatNodeText';
import {JSX} from 'react';
import {SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {IColor} from '../colors';
import {BasicNodeDisplay, NodeDisplayProps} from './BasicNodeDisplay';

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

interface IProps extends NodeDisplayProps {
  parentMatched?: boolean;
}

function TextDisplay({currentNode, allNodes, selectedNodeId, onNodeClick, dragProps, matches, depth, matchEditData}: NodeDisplayProps): JSX.Element {

  const mainMatchColor: IColor | undefined = matches.find(({sampleValue}) => currentNode.id === sampleValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  return (
    <FlatNodeText side={SideSelector.Sample} selectionState={selectionState} node={currentNode} dragProps={dragProps} mainMatchColor={mainMatchColor}
      depth={depth} onClick={onNodeClick} focusedAnnotation={undefined} currentEditedAnnotation={undefined}/>
  );
}

export function SampleSolutionNodeDisplay(props: IProps): JSX.Element {
  return (
    <BasicNodeDisplay otherProps={props}>
      {(textProps) => <TextDisplay {...textProps}/>}
    </BasicNodeDisplay>
  );
}
