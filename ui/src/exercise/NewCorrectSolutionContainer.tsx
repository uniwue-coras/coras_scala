import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {FlatSolutionNodeFragment, NodeMatchFragment, useNewCorrectionQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {DragStatusProps, FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import update from 'immutability-helper';
import {colors} from '../colors';
import {CorrectionColumn} from './CorrectionColumn';

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

interface IState {
  matches: ColoredMatch[];
  draggedSide?: SideSelector;
  selectedNodeId?: {
    side: SideSelector;
    nodeId: number;
  };
  showSubTexts: boolean;
}

function Inner({sampleSolution, userSolution, initialMatches}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({
    matches: initialMatches.map((m, index) => ({...m, color: colors[index]})),
    showSubTexts: true
  });

  function triggerNodeSelect(side: SideSelector, nodeId: number | undefined): void {
    setState((state) => update(state, {selectedNodeId: {$set: nodeId !== undefined ? {side, nodeId} : nodeId}}));
  }

  function getSelectedMatch(): ColoredMatch | undefined {
    if (!state.selectedNodeId) {
      return undefined;
    }

    const {side, nodeId} = state.selectedNodeId;

    return state.matches.find(({sampleValue, userValue}) => nodeId === (side === SideSelector.Sample ? sampleValue : userValue));
  }


  function getMarkedNodeIdProps(side: SideSelector): MarkedNodeIdProps {

    const selectedNodeId = state.selectedNodeId;

    return {
      nodeId: selectedNodeId !== undefined && selectedNodeId.side === side ? selectedNodeId.nodeId : undefined,
      matchingNodeIds: selectedNodeId !== undefined && selectedNodeId.side !== side
        ? state.matches
          .filter(({sampleValue, userValue}) => selectedNodeId.nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
          .map(({sampleValue, userValue}) => side === SideSelector.Sample ? userValue : sampleValue)
        : undefined
    };
  }

  function clearMatchFromSelection(): void {
    if (state.selectedNodeId) {
      const {side, nodeId} = state.selectedNodeId;

      setState((state) => update(state, {
        matches: (mr) => mr.filter(({sampleValue, userValue}) => side === SideSelector.Sample ? sampleValue !== nodeId : userValue !== nodeId),
        selectedNodeId: {$set: undefined}
      }));
    }
  }

  const dragProps: DragStatusProps = {
    draggedSide: state.draggedSide,
    setDraggedSide: (side: SideSelector | undefined) => setState((state) => update(state, {draggedSide: {$set: side}})),
    onDrop: (sampleValue, userValue) => setState((state) => update(state, {matches: {$push: [{sampleValue, userValue, color: colors[state.matches.length]}]}})) //sampleNodeId + ' :: ' + userNodeId)
  };


  const selectedMatch = getSelectedMatch();

  return (
    <div className="mb-12 grid grid-cols-3 gap-2">

      <div className="px-2 max-h-screen overflow-scroll">
        <div className="font-bold text-center">{t('sampleSolution')}</div>

        {getFlatSolutionNodeChildren(sampleSolution, null).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} matches={state.matches} side={SideSelector.Sample} currentNode={root} allNodes={sampleSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)} dragProps={dragProps}
                                   triggerNodeSelect={(nodeId) => triggerNodeSelect(SideSelector.Sample, nodeId)}/>)}
      </div>

      <div className="px-2 max-h-screen overflow-scroll">
        <div className="font-bold text-center">{t('learnerSolution')}</div>

        {getFlatSolutionNodeChildren(userSolution, null).map((userRoot) =>
          <FlatSolutionNodeDisplay key={userRoot.id} matches={state.matches} side={SideSelector.User} currentNode={userRoot} allNodes={userSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.User)} dragProps={dragProps}
                                   triggerNodeSelect={(nodeId) => triggerNodeSelect(SideSelector.User, nodeId)}/>)}
      </div>

      <div className="px-2 max-h-screen">
        <div className="font-bold text-center">{t('correction')}</div>

        {selectedMatch && <CorrectionColumn clearMatch={clearMatchFromSelection} selectedMatch={selectedMatch}/>}
      </div>

    </div>
  );
}

export function NewCorrectSolutionContainer(): JSX.Element {

  const {exId, username} = useParams<{ exId: string, username: string }>();
  if (!exId || !username) {
    return <Navigate to={homeUrl}/>;
  }
  const exerciseId = parseInt(exId);

  return (
    <WithQuery query={useNewCorrectionQuery({variables: {username, exerciseId}})}>
      {({exercise: {flatSampleSolution, flatUserSolution, flatCorrectionForUser}}) =>
        <Inner sampleSolution={flatSampleSolution} userSolution={flatUserSolution} initialMatches={flatCorrectionForUser}/>}
    </WithQuery>
  );
}
