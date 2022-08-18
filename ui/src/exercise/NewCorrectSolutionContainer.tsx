import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatCorrectionFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {FlatSolutionNodeDisplay, getFlatSolutionNodeChildren} from './FlatSolutionNodeDisplay';
import {useState} from 'react';

interface IProps {
  flatCorrection: FlatCorrectionFragment;
}

interface HoveredSampleNode {
  _type: 'sample';
  nodeId: number;
}

interface HoveredUserNode {
  _type: 'user';
  nodeId: number;
}

export type CurrentHoveredNode = HoveredSampleNode | HoveredUserNode;

function currentHoveredSampleNodeId(node: CurrentHoveredNode | undefined): number | undefined {
  return node !== undefined && node._type === 'sample' ? node.nodeId : undefined;
}

function currentHoveredUserNodeId(node: CurrentHoveredNode | undefined): number | undefined {
  return node !== undefined && node._type === 'user' ? node.nodeId : undefined;
}

function Inner({flatCorrection: {sampleSolution, userSolution, matchingResult}}: IProps): JSX.Element {

  const [hoveredNode, setHoveredNode] = useState<CurrentHoveredNode>();

  function updateHoveredNodeIdFromSampleSolution(nodeId: number | undefined): void {
    setHoveredNode(() => nodeId === undefined ? undefined : {_type: 'sample', nodeId});
  }

  function updateHoveredNodeIdFromUserSolution(nodeId: number | undefined): void {
    setHoveredNode(() => nodeId === undefined ? undefined : {_type: 'user', nodeId});
  }

  const matchingSampleNodes = hoveredNode !== undefined && hoveredNode._type === 'user'
    ? matchingResult.filter(({userNodeId}) => userNodeId === hoveredNode.nodeId).map(({sampleNodeId}) => sampleNodeId)
    : [];

  const matchingUserNodes = hoveredNode !== undefined && hoveredNode._type === 'sample'
    ? matchingResult.filter(({sampleNodeId}) => sampleNodeId === hoveredNode.nodeId).map(({userNodeId}) => userNodeId)
    : [];

  return (
    <div className="px-2 grid grid-cols-2 gap-2">
      <div>
        {getFlatSolutionNodeChildren(sampleSolution).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} currentNode={root} allNodes={sampleSolution} currentHoveredNodeId={currentHoveredSampleNodeId(hoveredNode)}
                                   updateHoveredNodeId={updateHoveredNodeIdFromSampleSolution} matchingNodeIds={matchingSampleNodes}/>)}
      </div>
      <div>
        {getFlatSolutionNodeChildren(userSolution).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} currentNode={userRoot} allNodes={userSolution} currentHoveredNodeId={currentHoveredUserNodeId(hoveredNode)}
                                   updateHoveredNodeId={updateHoveredNodeIdFromUserSolution} matchingNodeIds={matchingUserNodes}/>)}
      </div>
    </div>
  );
}

export function NewCorrectSolutionContainer({exerciseId}: { exerciseId: number }): JSX.Element {

  const username = useParams<'username'>().username;

  if (!username) {
    return <Navigate to={homeUrl}/>;
  }


  const query = useNewCorrectionQuery({variables: {username, exerciseId}});


  return (
    <WithQuery query={query}>
      {({exercise}) => <Inner flatCorrection={exercise.flatCorrectionForUser}/>}
    </WithQuery>
  );
}
