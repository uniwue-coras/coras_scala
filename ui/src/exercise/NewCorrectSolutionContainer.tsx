import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatSolutionNodeFragment, NodeMatchFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  sampleSolution: FlatSolutionNodeFragment[];
  userSolution: FlatSolutionNodeFragment[];
  flatCorrection: NodeMatchFragment[];
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

export type CurrentMarkedNodeId = {
  side: SideSelector;
  nodeId: number;
};

function getMarkedNodeIdProps(
  markedNode: CurrentMarkedNodeId | undefined,
  setMarkedNode: Dispatch<SetStateAction<CurrentMarkedNodeId | undefined>>,
  matchingResult: NodeMatchFragment[],
  side: SideSelector
): MarkedNodeIdProps {
  return {
    nodeId: (markedNode !== undefined && markedNode.side === side) ? markedNode.nodeId : undefined,
    matchingNodeIds: (markedNode !== undefined && markedNode.side !== side)
      ? matchingResult
        .filter(({sampleValue, userValue}) => markedNode.nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
        .map(({sampleValue, userValue}) => side === SideSelector.Sample ? userValue : sampleValue)
      : [],
    updateNodeId: (nodeId) => setMarkedNode(nodeId === undefined ? undefined : {side, nodeId})
  };
}

function Inner({sampleSolution, userSolution, flatCorrection: initialMatchingResult}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  // TODO: make matchingResults to state!

  // const [showSubTexts, setShowSubTexts] = useState(true);

  const [matchingResult, setMatchingResult] = useState(initialMatchingResult);

  const [draggedSide, setDraggedSide] = useState<SideSelector>();
  const [hoveredNodeId, setHoveredNodeId] = useState<CurrentMarkedNodeId>();
  const [selectedNodeId, setSelectedNodeId] = useState<CurrentMarkedNodeId>();

  function clearMatch(clickedNodeId: number): void {
    if (selectedNodeId) {
      const [sampleNodeIdToDelete, userNodeIdToDelete] = selectedNodeId.side === 'sample'
        ? [clickedNodeId, selectedNodeId.nodeId]
        : [selectedNodeId.nodeId, clickedNodeId];

      // TODO: clear child matches?

      setMatchingResult((matchingResult) =>
        matchingResult.filter(({sampleValue, userValue}) => sampleValue !== sampleNodeIdToDelete && userValue !== userNodeIdToDelete)
      );
    }
  }

  const hoveredNodeIdSample = getMarkedNodeIdProps(hoveredNodeId, setHoveredNodeId, matchingResult, SideSelector.Sample);
  const selectedNodeIdSample = getMarkedNodeIdProps(selectedNodeId, setSelectedNodeId, matchingResult, SideSelector.Sample);

  const hoveredNodeIdUser = getMarkedNodeIdProps(hoveredNodeId, setHoveredNodeId, matchingResult, SideSelector.User);
  const selectedNodeIdUser = getMarkedNodeIdProps(selectedNodeId, setSelectedNodeId, matchingResult, SideSelector.User);

  return (
    <div className="px-2 grid grid-cols-3 gap-2">
      <div>
        <div className="font-bold text-center">{t('sampleSolution')}</div>

        {getFlatSolutionNodeChildren(sampleSolution).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} side={SideSelector.Sample} currentNode={root} allNodes={sampleSolution}
                                   hoveredNodeId={hoveredNodeIdSample} selectedNodeId={selectedNodeIdSample}
                                   dragProps={{draggedSide, setDraggedSide}} clearMatch={clearMatch}/>)}
      </div>
      <div className="col-span-2">
        <div className="font-bold text-center">{t('learnerSolution')}</div>

        {getFlatSolutionNodeChildren(userSolution).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} side={SideSelector.User} currentNode={userRoot} allNodes={userSolution}
                                   hoveredNodeId={hoveredNodeIdUser} selectedNodeId={selectedNodeIdUser}
                                   dragProps={{draggedSide, setDraggedSide}} clearMatch={clearMatch}/>)}
      </div>
    </div>
  );
}

export function NewCorrectSolutionContainer({exerciseId}: { exerciseId: number }): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }

  return (
    <WithQuery query={useNewCorrectionQuery({variables: {username, exerciseId}})}>
      {({exercise: {flatSampleSolution, flatUserSolution, flatCorrectionForUser}}) =>
        <Inner sampleSolution={flatSampleSolution} userSolution={flatUserSolution} flatCorrection={flatCorrectionForUser}/>}
    </WithQuery>
  );
}
