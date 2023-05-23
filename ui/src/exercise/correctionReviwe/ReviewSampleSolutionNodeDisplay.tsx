import {JSX} from 'react';
import {NodeDisplayProps} from '../BasicNodeDisplay';

interface IProps extends NodeDisplayProps {
  parentMatched?: boolean;
}

export function ReviewSampleSolutionNodeDisplay({allNodes, currentNode, parentMatched, matches, depth}: IProps): JSX.Element {
  return <div>{currentNode.text}</div>;
}
