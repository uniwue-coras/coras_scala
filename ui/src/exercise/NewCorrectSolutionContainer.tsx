import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatSolutionNodeFragment, NodeMatchFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {DragStatusProps, FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import update from 'immutability-helper';
import {colors} from '../colors';

export interface ColoredMatch extends NodeMatchFragment {
  color: string;
}

interface InnerProps {
  sampleSolution: FlatSolutionNodeFragment[];
  userSolution: FlatSolutionNodeFragment[];
  initialMatches: NodeMatchFragment[];
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

export type CurrentMarkedNodeId = {
  side: SideSelector;
  nodeId: number;
};

interface IState {
  matches: ColoredMatch[];
  draggedSide?: SideSelector;
  selectedNodeId?: CurrentMarkedNodeId;
  showSubTexts: boolean;
}

function Inner({sampleSolution, userSolution, initialMatches}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({
    matches: initialMatches.map((m, index) => ({...m, color: colors[index]})),
    showSubTexts: true
  });

  function getMarkedNodeIdProps(side: SideSelector): MarkedNodeIdProps {

    const markedNode = state.selectedNodeId;

    return {
      nodeId: markedNode !== undefined && markedNode.side === side
        ? markedNode.nodeId
        : undefined,
      matchingNodeIds: markedNode !== undefined && markedNode.side !== side
        ? state.matches
          .filter(({sampleValue, userValue}) => markedNode.nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
          .map(({sampleValue, userValue}) => side === SideSelector.Sample ? userValue : sampleValue)
        : [],
      updateNodeId: (nodeId) => setState((state) => update(state, {selectedNodeId: {$set: nodeId !== undefined ? {side, nodeId} : nodeId}}))
    };
  }

  function clearMatchFromSample(clickedNodeId: number): void {
    if (state.selectedNodeId) {
      const selectedNodeId = state.selectedNodeId.nodeId;

      setState((state) => update(state, {
        matches: (mr) => mr.filter(({sampleValue, userValue}) => sampleValue !== clickedNodeId && userValue !== selectedNodeId)
      }));
    }
  }

  function clearMatchFromUser(clickedNodeId: number): void {
    if (state.selectedNodeId) {
      const selectedNodeId = state.selectedNodeId.nodeId;

      setState((state) => update(state, {
        matches: (mr) => mr.filter(({sampleValue, userValue}) => sampleValue !== selectedNodeId && userValue !== clickedNodeId)
      }));
    }
  }

  function setDraggedSide(side: SideSelector | undefined): void {
    setState((state) => update(state, {draggedSide: {$set: side}}));
  }

  const dragProps: DragStatusProps = {
    draggedSide: state.draggedSide,
    setDraggedSide,
    onDrop: (sampleValue, userValue) => setState((state) => update(state, {matches: {$push: [{sampleValue, userValue, color: colors[state.matches.length]}]}})) //sampleNodeId + ' :: ' + userNodeId)
  };

  return (
    <div className="mb-12 grid grid-cols-3 gap-2">
      <div className="px-2 max-h-screen overflow-scroll">
        <div className="font-bold text-center">{t('sampleSolution')}</div>

        {getFlatSolutionNodeChildren(sampleSolution).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} matches={state.matches} side={SideSelector.Sample} currentNode={root} allNodes={sampleSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)} dragProps={dragProps}
                                   clearMatch={clearMatchFromSample}/>)}
      </div>
      <div className="px-2 max-h-screen overflow-scroll col-span-2">
        <div className="font-bold text-center">{t('learnerSolution')}</div>

        {getFlatSolutionNodeChildren(userSolution).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} matches={state.matches} side={SideSelector.User} currentNode={userRoot} allNodes={userSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.User)} dragProps={dragProps}
                                   clearMatch={clearMatchFromUser}/>)}
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
        <Inner sampleSolution={flatSampleSolution} userSolution={flatUserSolution} initialMatches={flatCorrectionForUser}/>}
    </WithQuery>
  );
}
