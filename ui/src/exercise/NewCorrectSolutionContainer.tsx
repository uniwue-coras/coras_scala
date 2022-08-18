import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatCorrectionFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  flatCorrection: FlatCorrectionFragment;
}

type SideSelector = 'sample' | 'user';

export type CurrentMarkedNodeId = {
  side: SideSelector;
  nodeId: number;
};

function currentMarkedNodeId(node: CurrentMarkedNodeId | undefined, side: SideSelector): number | undefined {
  return node !== undefined && node.side === side ? node.nodeId : undefined;
}

type State<S> = [S | undefined, Dispatch<SetStateAction<S | undefined>>];

function Inner({flatCorrection: {sampleSolution, userSolution, matchingResult}}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const [showSubTexts, setShowSubTexts] = useState(true);
  const hoveredNodeState = useState<CurrentMarkedNodeId>();
  const selectedNodeState: State<CurrentMarkedNodeId> = useState<CurrentMarkedNodeId>();
  
  function getMarkedNodeIdProps([markedNode, setMarkedNode]: State<CurrentMarkedNodeId>, side: SideSelector): MarkedNodeIdProps {
    return {
      nodeId: currentMarkedNodeId(markedNode, side),
      matchingNodeIds: markedNode !== undefined && markedNode.side !== side
        ? matchingResult
          .filter(({sampleNodeId, userNodeId}) => markedNode.nodeId === (side === 'sample' ? sampleNodeId : userNodeId))
          .map(({sampleNodeId, userNodeId}) => side === 'sample' ? userNodeId : sampleNodeId)
        : [],
      updateNodeId: (nodeId) => setMarkedNode(nodeId === undefined ? undefined : {side, nodeId})
    };
  }

  return (
    <div className="px-2 grid grid-cols-2 gap-2">
      <div className="font-bold text-center">{t('sampleSolution')}</div>
      <div className="font-bold text-center">{t('learnerSolution')}</div>
      <div>
        {getFlatSolutionNodeChildren(sampleSolution).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} currentNode={root} allNodes={sampleSolution}
                                   hoveredNodeId={getMarkedNodeIdProps(hoveredNodeState, 'sample')}
                                   selectedNodeId={getMarkedNodeIdProps(selectedNodeState, 'sample')}/>)}
      </div>
      <div>
        {getFlatSolutionNodeChildren(userSolution).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} currentNode={userRoot} allNodes={userSolution}
                                   hoveredNodeId={getMarkedNodeIdProps(hoveredNodeState, 'user')}
                                   selectedNodeId={getMarkedNodeIdProps(selectedNodeState, 'user')}/>)}
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
