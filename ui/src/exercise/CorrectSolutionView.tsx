import {FlatSolutionNodeFragment, NodeMatchFragment} from '../graphql';
import {colors, IColor} from '../colors';
import {IAnnotation, readSelection} from './shortCutHelper';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {CorrectionColumn, ErrorType} from './CorrectionColumn';
import update, {Spec} from 'immutability-helper';
import {DragStatusProps, FlatSolutionNodeDisplay, getFlatSolutionNodeChildren, MarkedNodeIdProps} from './FlatSolutionNodeDisplay';
import {AnnotationView} from './AnnotationView';

export interface ColoredMatch extends NodeMatchFragment {
  color: IColor;
}

interface IProps {
  sampleSolution: FlatSolutionNodeFragment[];
  userSolution: FlatSolutionNodeFragment[];
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
  matches: ColoredMatch[];
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
  showSubTexts: boolean;
  annotations: IAnnotation[];
}

export function CorrectSolutionView({sampleSolution, userSolution, initialMatches}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({
    matches: initialMatches.map((m, index) => ({...m, color: colors[index]})),
    showSubTexts: true,
    annotations: []
  });

  const keyDownEventListener = (event: KeyboardEvent): void => {
    if (state.currentSelection && state.currentSelection._type === 'IAnnotation' || (event.key !== 'f' && event.key !== 'm')) {
      // Currently only react to 'f'
      return;
    }

    const errorType = {
      'f': ErrorType.Wrong,
      'm': ErrorType.Missing
    }[event.key];

    const annotation = readSelection(errorType);

    if (annotation !== undefined) {
      setState((state) => update(state, {currentSelection: {$set: annotation}}));
    }
  };

  useEffect(() => {
    addEventListener('keydown', keyDownEventListener);
    return () => removeEventListener('keydown', keyDownEventListener);
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

  function clearMatchFromSelection(): void {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
      return;
    }

    const {side, nodeId} = state.currentSelection;

    setState((state) => update(state, {
      matches: (matches) => matches.filter(({sampleValue, userValue}) => nodeId !== (side === SideSelector.Sample ? sampleValue : userValue)),
      currentSelection: {$set: undefined}
    }));
  }

  const dragProps: DragStatusProps = {
    draggedSide: state.draggedSide,
    setDraggedSide: (side: SideSelector | undefined) => setState((state) => update(state, {draggedSide: {$set: side}})),
    onDrop: (sampleValue, userValue) => setState((state) => update(state, {matches: {$push: [{sampleValue, userValue, color: colors[state.matches.length]}]}})) //sampleNodeId + ' :: ' + userNodeId)
  };

  // annotation

  const onCancelAnnotation = () => setState((state) => update(state, {currentSelection: {$set: undefined}}));

  const onUpdateAnnotation = (spec: Spec<IAnnotation>) => {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'IAnnotation') {
      return;
    }

    setState((state) => update(state, {currentSelection: spec as Spec<CurrentSelection | undefined>}));
  };

  const onAnnotationSubmit = (): void => {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'IAnnotation') {
      return;
    }

    const annotation = state.currentSelection;

    setState((state) => update(state, {annotations: {$push: [annotation]}}));
    onCancelAnnotation();
  };

  return (
    <div className="mb-12 grid grid-cols-3 gap-2">

      <div className="px-2 max-h-screen overflow-scroll">
        <div className="font-bold text-center">{t('sampleSolution')}</div>

        {getFlatSolutionNodeChildren(sampleSolution, null).map((root) =>
          <FlatSolutionNodeDisplay key={root.id} matches={state.matches} side={SideSelector.Sample} currentNode={root} allNodes={sampleSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)} dragProps={dragProps}
                                   onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)}/>)}
      </div>

      <div className="px-2 max-h-screen overflow-scroll">
        <div className="font-bold text-center">{t('learnerSolution')}</div>

        {getFlatSolutionNodeChildren(userSolution, null).map((userRoot) =>
          // TODO: mark selected annotation range...
          <FlatSolutionNodeDisplay key={userRoot.id} matches={state.matches} side={SideSelector.User} currentNode={userRoot} allNodes={userSolution}
                                   showSubTexts={state.showSubTexts} selectedNodeId={getMarkedNodeIdProps(SideSelector.User)} dragProps={dragProps}
                                   onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
                                   currentSelection={state.currentSelection}/>)}
      </div>

      <div className="px-2 max-h-screen">
        <div className="font-bold text-center">{t('correction')}</div>

        {state.currentSelection
          ? (
            state.currentSelection._type === 'IAnnotation'
              ? <AnnotationView annotation={state.currentSelection} updateAnnotation={onUpdateAnnotation} cancelAnnotation={onCancelAnnotation}
                                submitAnnotation={onAnnotationSubmit}/>
              : <CorrectionColumn clearMatch={clearMatchFromSelection} selectedMatch={state.currentSelection.match}/>
          )
          : state.annotations.map((annotation) => <div key={annotation.nodeId + '_' + annotation.startOffset + '_' + annotation.endOffset}>
            {annotation.comment}
          </div>)}
      </div>

    </div>
  );
}
