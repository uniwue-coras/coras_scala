import { FlatNodeText } from './FlatNodeText';
import { ReactElement } from 'react';
import { SideSelector } from './CorrectSolutionView';
import { getSelectionState } from './selectionState';
import { BasicNodeDisplay, CorrectionNodeDisplayProps } from './BasicNodeDisplay';
import { SampleSolutionNodeFragment, SolutionNodeFragment } from '../graphql';
import { allMatchColors } from '../allMatchColors';
import { MatchEdit } from './MatchEdit';
import classNames from 'classnames';


interface IProps extends CorrectionNodeDisplayProps<SampleSolutionNodeFragment> {
  parentMatched: boolean;
}

function TextDisplay({ currentNode/*, allNodes*/, selectedNodeId, onNodeClick, dragProps, matches, depth, matchEditData, parentMatched }: IProps): ReactElement {

  const maybeMatch = matches.find(({ sampleNodeId }) => currentNode.id === sampleNodeId);

  const mainMatchColor: string | undefined = maybeMatch !== undefined
    ? allMatchColors[maybeMatch.sampleNodeId]
    : undefined;

  const matchEditDataForNode = matchEditData !== undefined && matchEditData.markedNodeSide === SideSelector.Sample && matchEditData.markedNode.id === currentNode.id
    ? matchEditData
    : undefined;

  if (matchEditDataForNode) {
    console.info(matchEditDataForNode);
  }

  return (
    <>
      <div className={classNames({ 'my-1 border-2 border-red-600': parentMatched && mainMatchColor === undefined })}>
        <FlatNodeText side={SideSelector.Sample} selectionState={getSelectionState(selectedNodeId, currentNode.id)} node={currentNode} dragProps={dragProps}
          mainMatchColor={mainMatchColor} depth={depth} onClick={onNodeClick} focusedAnnotation={undefined} currentEditedAnnotation={undefined} />

        {currentNode.subTexts.map((s, index) => <p key={index}>{s}</p>)}
      </div>

      {/* FIXME: edit matches... */}
      {matchEditDataForNode && <MatchEdit {...matchEditDataForNode} />}
    </>
  );
}

type LoopedProps = Omit<IProps, 'currentNode' | 'depth' | 'allNodes'>;

const adjustLoopedProps = (currentNode: SolutionNodeFragment, { matches, ...data }: LoopedProps): LoopedProps => {
  return { ...data, matches, parentMatched: matches.some(({ sampleNodeId }) => sampleNodeId === currentNode.id) };
};

export function CorrectionSampleSolNode(props: IProps): ReactElement {
  return (
    <BasicNodeDisplay otherProps={props} adjustLoopedProps={adjustLoopedProps}>
      {(textProps) => <TextDisplay {...textProps} />}
    </BasicNodeDisplay>
  );
}
