import {
  AnnotationFragment,
  AnnotationInput,
  ErrorType,
  FlatSolutionNodeFragment,
  FlatUserSolutionNodeFragment,
  NodeMatchFragment,
  useDeleteAnnotationMutation,
  useSubmitAnnotationMutation,
  useUpdateAnnotationMutation
} from '../graphql';
import {colors, IColor} from '../colors';
import {NewAnnotationInputData, readSelection} from './shortCutHelper';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import update, {Spec} from 'immutability-helper';
import {DragStatusProps, getFlatSolutionNodeChildren, MarkedNodeIdProps, UserSolutionNodeDisplay} from './UserSolutionNodeDisplay';
import {SampleSolutionNodeDisplay} from './SampleSolutionNodeDisplay';

export interface ColoredMatch extends NodeMatchFragment {
  color: IColor;
}

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: FlatSolutionNodeFragment[];
  initialUserSolution: FlatUserSolutionNodeFragment[];
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

export interface AnnotationEditData {
  _type: 'AnnotationEditData';
  nodeId: number;
  annotationId: number;
  annotation: AnnotationInput;
  maxEndOffset: number;
}

export type CurrentSelection = NewAnnotationInputData | MatchSelection | AnnotationEditData;

interface IState {
  userSolution: FlatUserSolutionNodeFragment[];
  matches: ColoredMatch[];
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
}

export function CorrectSolutionView({username, exerciseId, sampleSolution, initialUserSolution, initialMatches}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({
    userSolution: initialUserSolution,
    matches: initialMatches.map((m, index) => ({...m, color: colors[index]}))
  });

  const [uploadAnnotation] = useSubmitAnnotationMutation();
  const [updateAnnotation] = useUpdateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const keyDownEventListener = (event: KeyboardEvent): void => {
    if (state.currentSelection !== undefined && state.currentSelection._type === 'NewAnnotationInputData') {
      // disable if editing annotation
      return;
    }

    if (event.key !== 'f' && event.key !== 'm') {
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

  const onNodeClick = (side: SideSelector, nodeId: number | undefined): void => {

    const selectedMatch: ColoredMatch | undefined = nodeId !== undefined
      ? state.matches.find(({sampleValue, userValue}) => nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
      : undefined;

    const matchSelect = nodeId !== undefined && selectedMatch !== undefined
      ? matchSelection(side, nodeId, selectedMatch)
      : undefined;

    setState((state) => update(state, {currentSelection: {$set: matchSelect}}));
  };

  function getMarkedNodeIdProps(side: SideSelector): MarkedNodeIdProps {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
      return {nodeId: undefined, matchingNodeIds: undefined};
    }

    const selection: MatchSelection = state.currentSelection;

    return {
      nodeId: selection.side === side ? selection.nodeId : undefined,
      matchingNodeIds: selection.side !== side
        ? state.matches
          .filter(({sampleValue, userValue}) => selection.nodeId === (side === SideSelector.Sample ? sampleValue : userValue))
          .map(({sampleValue, userValue}) => (side === SideSelector.Sample) ? userValue : sampleValue)
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

  const onUpdateAnnotation = (spec: Spec<AnnotationInput>) => setState((state) =>
    state.currentSelection !== undefined && state.currentSelection._type === 'NewAnnotationInputData'
      ? update(state, {currentSelection: {annotationInput: spec}})
      : state
  );

  const submitAnnotation = async (): Promise<void> => {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'NewAnnotationInputData') {
      return;
    }

    const {annotationInput, nodeId} = state.currentSelection;

    const y = await uploadAnnotation({variables: {username, exerciseId, userSolutionNodeId: nodeId, annotationInput}});

    if (y.errors !== undefined) {
      alert('Errors:\n' + y.errors);
      return;
    }

    const annotation: AnnotationFragment | null | undefined = y.data?.exerciseMutations?.userSolutionNode?.submitAnnotation;

    if (annotation === null || annotation === undefined) {
      alert('Error!');
      return;
    }

    setState((state) => update(state, {userSolution: {[nodeId]: {annotations: {$push: [annotation]}}}}));

    cancelAnnotation();
  };

  const editAnnotation = (nodeId: number, annotationId: number): void => {
    const annotation = state.userSolution[nodeId].annotations[annotationId];

    console.info('TODO: ' + nodeId + ' :: ' + annotationId + '\n' + JSON.stringify(annotation));
  };

  const onRemoveAnnotation = async (nodeId: number, annotationId: number): Promise<void> => {

    const deletionResult = await deleteAnnotation({variables: {username, exerciseId, userSolutionNodeId: nodeId, annotationId}});

    if (deletionResult.errors !== undefined) {
      alert('ERROR!');
      return;
    }

    setState((state) =>
      update(state, {userSolution: {[nodeId]: {annotations: {$apply: (annotations: AnnotationFragment[]) => annotations.filter(({id}) => id !== annotationId)}}}})
    );
  };

  return (
    <div className="mb-12 grid grid-cols-3 gap-2">

      {/* Left column */}
      <section className="px-2 max-h-screen overflow-scroll">
        <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

        {getFlatSolutionNodeChildren(sampleSolution, null).map((sampleRoot) =>
          <SampleSolutionNodeDisplay
            key={sampleRoot.id}
            matches={state.matches}
            currentNode={sampleRoot}
            allNodes={sampleSolution}
            selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)}
            dragProps={dragProps}
            onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)}/>)}
      </section>

      {/* Middle & right column */}
      <section className="px-2 max-h-screen col-span-2 overflow-scroll">
        <div>
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          {getFlatSolutionNodeChildren(state.userSolution, null).map((userRoot) =>
            <UserSolutionNodeDisplay
              key={userRoot.id}
              matches={state.matches}
              currentNode={userRoot}
              allNodes={state.userSolution}
              selectedNodeId={getMarkedNodeIdProps(SideSelector.User)}
              dragProps={dragProps}
              onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
              currentSelection={state.currentSelection}
              annotationEditingProps={{cancelAnnotation, updateAnnotation: onUpdateAnnotation, submitAnnotation}}
              editAnnotation={editAnnotation}
              removeAnnotation={onRemoveAnnotation}/>)}
        </div>

      </section>

    </div>
  );
}
