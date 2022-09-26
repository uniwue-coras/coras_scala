import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatCorrectionFragment, FlatSolutionNodeMatchFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  flatCorrection: FlatCorrectionFragment;
}

export type SideSelector = 'sample' | 'user';

export type CurrentMarkedNodeId = {
  side: SideSelector;
  nodeId: number;
};

function getMarkedNodeIdProps(
  markedNode: CurrentMarkedNodeId | undefined,
  setMarkedNode: Dispatch<SetStateAction<CurrentMarkedNodeId | undefined>>,
  matchingResult: FlatSolutionNodeMatchFragment[],
  side: SideSelector
): MarkedNodeIdProps {
  return {
    nodeId: (markedNode !== undefined && markedNode.side === side) ? markedNode.nodeId : undefined,
    matchingNodeIds: (markedNode !== undefined && markedNode.side !== side)
      ? matchingResult
        .filter(({sampleNodeId, userNodeId}) => markedNode.nodeId === (side === 'sample' ? sampleNodeId : userNodeId))
        .map(({sampleNodeId, userNodeId}) => side === 'sample' ? userNodeId : sampleNodeId)
      : [],
    updateNodeId: (nodeId) => setMarkedNode(nodeId === undefined ? undefined : {side, nodeId})
  };
}

function Inner({flatCorrection: {sampleSolution, userSolution, matchingResult: initialMatchingResult}}: IProps): JSX.Element {

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
        matchingResult.filter(({sampleNodeId, userNodeId}) => sampleNodeId !== sampleNodeIdToDelete && userNodeId !== userNodeIdToDelete)
      );
    }
  }

  const hoveredNodeIdSample = getMarkedNodeIdProps(hoveredNodeId, setHoveredNodeId, matchingResult, 'sample');
  const selectedNodeIdSample = getMarkedNodeIdProps(selectedNodeId, setSelectedNodeId, matchingResult, 'sample');

  const hoveredNodeIdUser = getMarkedNodeIdProps(hoveredNodeId, setHoveredNodeId, matchingResult, 'user');
  const selectedNodeIdUser = getMarkedNodeIdProps(selectedNodeId, setSelectedNodeId, matchingResult, 'user');

  return (
    <div className="px-2 grid grid-cols-3 gap-2">
      <div>
        <div className="font-bold text-center">{t('sampleSolution')}</div>

        {getFlatSolutionNodeChildren(sampleSolution).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} side={'sample'} currentNode={root} allNodes={sampleSolution}
                                   hoveredNodeId={hoveredNodeIdSample} selectedNodeId={selectedNodeIdSample}
                                   dragProps={{draggedSide, setDraggedSide}} clearMatch={clearMatch}/>)}
      </div>
      <div className="col-span-2">
        <div className="font-bold text-center">{t('learnerSolution')}</div>

        {getFlatSolutionNodeChildren(userSolution).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} side={'user'} currentNode={userRoot} allNodes={userSolution}
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
      {({exercise}) => <Inner flatCorrection={exercise.flatCorrectionForUser}/>}
    </WithQuery>
  );
}
