import {FlatSolutionNodeFragment, NodeMatchFragment} from '../graphql';
import {colors, IColor} from '../colors';
import {IAnnotation, readSelection} from './shortCutHelper';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {ErrorType} from './CorrectionColumn';
import update, {Spec} from 'immutability-helper';
import {DragStatusProps, getFlatSolutionNodeChildren, MarkedNodeIdProps, UserSolutionNodeDisplay} from './UserSolutionNodeDisplay';
import {SampleSolutionNodeDisplay} from './SampleSolutionNodeDisplay';

export interface ColoredMatch extends NodeMatchFragment {
  color: IColor;
}

export interface FlatSolutionNodeWithAnnotations extends FlatSolutionNodeFragment {
  annotations: IAnnotation[];
}

interface IProps {
  sampleSolution: FlatSolutionNodeFragment[];
  initialUserSolution: FlatSolutionNodeFragment[];
  initialMatches: NodeMatchFragment[];
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

interface MatchSelection {
  _type: 'MatchSelection';
  side: SideSelector;
  nodeId: number;
  match: ColoredMatch;
}

function matchSelection(side: SideSelector, nodeId: number, match: ColoredMatch): MatchSelection {
  return {_type: 'MatchSelection', side, nodeId, match};
}

export type CurrentSelection = IAnnotation | MatchSelection;

interface IState {
  userSolution: FlatSolutionNodeWithAnnotations[];
  matches: ColoredMatch[];
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
  showSubTexts: boolean;
}

export function CorrectSolutionView({sampleSolution, initialUserSolution, initialMatches}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({
    userSolution: initialUserSolution.map((node) => ({...node, annotations: []})),
    matches: initialMatches.map((m, index) => ({...m, color: colors[index]})),
    showSubTexts: true
  });

  const keyDownEventListener = (event: KeyboardEvent): void => {
    if (state.currentSelection !== undefined && state.currentSelection._type === 'IAnnotation' || (event.key !== 'f' && event.key !== 'm')) {
      // Currently only react to 'f' and 'm'
      return;
    }

    const errorType = {
      'f': ErrorType.Wrong,
      'm': ErrorType.Missing
    }[event.key];

    const annotation = readSelection(errorType);

    if (annotation !== undefined) {
      disableKeyDownEventListener();
      setState((state) => update(state, {currentSelection: {$set: annotation}}));
    }
  };

  const enableKeyDownEventListener = () => addEventListener('keydown', keyDownEventListener);
  const disableKeyDownEventListener = () => removeEventListener('keydown', keyDownEventListener);

  useEffect(() => {
    enableKeyDownEventListener();
    return disableKeyDownEventListener;
  });

  function onNodeClick(side: SideSelector, nodeId: number | undefined): void {

    const selectedMatch: ColoredMatch | undefined = nodeId !== undefined
      ? state.matches.find(({sampleValue, userValue}) => nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
      : undefined;

    const matchSelect = nodeId !== undefined && selectedMatch !== undefined
      ? matchSelection(side, nodeId, selectedMatch)
      : undefined;

    setState((state) => update(state, {currentSelection: {$set: matchSelect}}));
  }

  function getMarkedNodeIdProps(side: SideSelector): MarkedNodeIdProps {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
      return {nodeId: undefined, matchingNodeIds: undefined};
    }

    const selection = state.currentSelection;

    return {
      nodeId: selection.side === side ? selection.nodeId : undefined,
      matchingNodeIds: selection.side !== side
        ? state.matches
          .filter(({sampleValue, userValue}) => selection.nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
          .map(({sampleValue, userValue}) => side === SideSelector.Sample ? userValue : sampleValue)
        : undefined
    };
  }

  const dragProps: DragStatusProps = {
    draggedSide: state.draggedSide,
    setDraggedSide: (side: SideSelector | undefined) => setState((state) => update(state, {draggedSide: {$set: side}})),
    onDrop: (sampleValue, userValue) => setState((state) => update(state, {matches: {$push: [{sampleValue, userValue, color: colors[state.matches.length]}]}})) //sampleNodeId + ' :: ' + userNodeId)
  };

  // annotation

  const cancelAnnotation = () => {
    enableKeyDownEventListener();
    setState((state) => update(state, {currentSelection: {$set: undefined}}));
  };

  const updateAnnotation = (spec: Spec<IAnnotation>) => {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'IAnnotation') {
      return;
    }

    setState((state) => update(state, {currentSelection: spec as Spec<CurrentSelection | undefined>}));
  };

  const submitAnnotation = (): void => {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'IAnnotation') {
      return;
    }

    const annotation = state.currentSelection;
    setState((state) => update(state, {userSolution: {[annotation.nodeId]: {annotations: {$push: [annotation]}}}}));
    cancelAnnotation();
  };

  const removeAnnotation = (nodeId: number, annotationIndex: number): void => setState((state) =>
    update(state, {userSolution: {[nodeId]: {annotations: {$splice: [[annotationIndex, 1]]}}}})
  );

  return (
    <div className="mb-12 grid grid-cols-3 gap-2">

      {/* Left column */}
      <section className="px-2 max-h-screen overflow-scroll">
        <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

        {getFlatSolutionNodeChildren(sampleSolution, null).map((sampleRoot) =>
          <SampleSolutionNodeDisplay key={sampleRoot.id} matches={state.matches} currentNode={sampleRoot} allNodes={sampleSolution}
                                     showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)} dragProps={dragProps}
                                     onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)}/>)}
      </section>

      {/* Middle & right column */}
      <section className="px-2 max-h-screen col-span-2 overflow-scroll">
        <div>
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          {getFlatSolutionNodeChildren(state.userSolution, null).map((userRoot) =>
            <UserSolutionNodeDisplay key={userRoot.id} matches={state.matches} currentNode={userRoot} allNodes={state.userSolution}
                                     showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.User)} dragProps={dragProps}
                                     onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
                                     currentSelection={state.currentSelection} editAnnotation={{cancelAnnotation, updateAnnotation, submitAnnotation}}
                                     removeAnnotation={removeAnnotation}/>)}
        </div>

        {/*state.currentSelection !== undefined &&
          <div>
            <h2 className="font-bold text-center">{t('correction')}</h2>

            {state.currentSelection._type === 'IAnnotation'
              ? <AnnotationView annotation={state.currentSelection} updateAnnotation={onUpdateAnnotation} cancelAnnotation={onCancelAnnotation}
                                submitAnnotation={onAnnotationSubmit}/>
              : <CorrectionColumn clearMatch={clearMatchFromSelection} selectedMatch={state.currentSelection.match}/>}
          </div>
        */}
      </section>

    </div>
  );
}
