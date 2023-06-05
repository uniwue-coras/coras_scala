import {
  AnnotationFragment,
  AnnotationInput,
  CorrectionSummaryFragment,
  ErrorType,
  FlatUserSolutionNodeFragment,
  IFlatSolutionNodeFragment,
  SolutionNodeMatchFragment,
  useDeleteAnnotationMutation,
  useDeleteMatchMutation,
  useFinishCorrectionMutation,
  UserSolutionFragment,
  useSubmitNewMatchMutation,
  useUpsertAnnotationMutation
} from '../graphql';
import {readSelection} from './shortCutHelper';
import {useTranslation} from 'react-i18next';
import {JSX, useEffect, useState} from 'react';
import update, {Spec} from 'immutability-helper';
import {SampleSolutionNodeDisplay} from './SampleSolutionNodeDisplay';
import {annotationInput, createOrEditAnnotationData, CurrentSelection, MatchSelection, matchSelection} from './currentSelection';
import {MyOption} from '../funcProg/option';
import {UserSolutionNodeDisplay} from './UserSolutionNodeDisplay';
import {DragStatusProps, getFlatSolutionNodeChildren} from './BasicNodeDisplay';
import {MarkedNodeIdProps} from './selectionState';
import {executeMutation} from '../mutationHelpers';
import {getMatchEditData} from './matchEditData';
import {EditCorrectionSummary} from './EditCorrectionSummary';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: IFlatSolutionNodeFragment[];
  initialUserSolution: UserSolutionFragment;
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

export interface CorrectSolutionViewState {
  userSolution: FlatUserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  correctionSummary: CorrectionSummaryFragment | undefined;
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
}

export function CorrectSolutionView({username, exerciseId, sampleSolution, initialUserSolution}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {nodes: initialUserNodes, matches: initialMatches, correctionSummary: initialCorrectionSummary} = initialUserSolution;

  const [keyHandlingEnabled, setKeyHandlingEnabled] = useState(true);
  const [state, setState] = useState<CorrectSolutionViewState>({
    userSolution: initialUserNodes,
    matches: initialMatches,
    correctionSummary: initialCorrectionSummary || undefined
  });

  const [submitNewMatch] = useSubmitNewMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();
  const [upsertAnnotation] = useUpsertAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();
  const [finishCorrection] = useFinishCorrectionMutation();

  const keyDownEventListener = (event: KeyboardEvent): void => {
    if (!keyHandlingEnabled) {
      return;
    }

    if (state.currentSelection !== undefined && state.currentSelection._type === 'CreateOrEditAnnotationData') {
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
      setKeyHandlingEnabled(false);
      setState((state) => update(state, {currentSelection: {$set: annotation}}));
    }
  };

  useEffect(() => {
    addEventListener('keyup', keyDownEventListener);
    return () => removeEventListener('keyup', keyDownEventListener);
  });

  const onNodeClick = (side: SideSelector, nodeId: number | undefined): void => setState(
    (state) => update(state, {currentSelection: {$set: nodeId !== undefined ? matchSelection(side, nodeId) : undefined}})
  );

  function getMarkedNodeIdProps(side: SideSelector): MarkedNodeIdProps {
    if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
      return {nodeId: undefined, matchingNodeIds: undefined};
    }

    const {side: selectionSide, nodeId}: MatchSelection = state.currentSelection;

    return {
      nodeId: selectionSide === side ? nodeId : undefined,
      matchingNodeIds: selectionSide !== side
        ? state.matches
          .filter(({sampleValue, userValue}) => selectionSide === SideSelector.Sample ? nodeId === sampleValue : nodeId === userValue)
          .map(({sampleValue, userValue}) => selectionSide === SideSelector.Sample ? userValue : sampleValue)
        : undefined
    };
  }

  const dragProps: DragStatusProps = {
    draggedSide: state.draggedSide,
    setDraggedSide: (side: SideSelector | undefined) => setState((state) => update(state, {draggedSide: {$set: side}})),
    onDrop: async (sampleValue: number, userValue: number): Promise<void> => {

      const result = await submitNewMatch({variables: {exerciseId, username, sampleNodeId: sampleValue, userNodeId: userValue}});

      if (result.data !== undefined && result.data !== null) {
        const newMatch = result.data.exerciseMutations.userSolution.node.submitMatch;

        setState((state) => update(state, {matches: {$push: [newMatch]}}));
      }
    }
  };

  // annotation

  const onUpdateAnnotation = (spec: Spec<AnnotationInput>) => setState((state) =>
    state.currentSelection !== undefined && state.currentSelection._type !== 'MatchSelection'
      ? update(state, {currentSelection: {annotationInput: spec}})
      : state
  );

  const onCancelAnnotationEdit = () => {
    setKeyHandlingEnabled(true);
    setState((state) => update(state, {currentSelection: {$set: undefined}}));
  };

  const onSubmitAnnotation = async (): Promise<void> => {
    if (state.currentSelection === undefined || state.currentSelection._type === 'MatchSelection') {
      return;
    }

    const {nodeId, maybeAnnotationId, annotationInput} = state.currentSelection;

    return executeMutation(
      () => upsertAnnotation({variables: {username, exerciseId, nodeId, maybeAnnotationId, annotationInput}}),
      ({exerciseMutations: {userSolution: {node: {upsertAnnotation: annotation}}}}) => {

        setState((state) => MyOption.of(state.userSolution.findIndex(({id}) => id === nodeId))
          .filter(nodeIndex => nodeIndex !== -1)
          .map(nodeIndex => {
            const innerSpec = MyOption.of(maybeAnnotationId)
              .flatMap<Spec<AnnotationFragment[]>>((annotationId) => {
                const annotationIndex = state.userSolution[nodeIndex].annotations.findIndex(({id}) => id === annotationId);

                return annotationIndex !== -1
                  ? MyOption.of({[annotationIndex]: {$set: annotation}})
                  : MyOption.empty();
              })
              .getOrElse({$push: [annotation]});

            return update(state, {userSolution: {[nodeIndex]: {annotations: innerSpec}}});
          })
          .getOrElse(state));

        onCancelAnnotationEdit();
      }
    );
  };

  const onEditAnnotation = (nodeId: number, annotationId: number): void => {

    const node = state.userSolution.find(({id}) => id === nodeId);
    if (node === undefined) {
      return;
    }

    const annotation = node.annotations.find(({id}) => id === annotationId);
    if (annotation === undefined) {
      return;
    }

    const {errorType, importance, startIndex, endIndex, text} = annotation;
    const newSelection = createOrEditAnnotationData(nodeId, annotationId, annotationInput(errorType, importance, startIndex, endIndex, text), node.text.length);

    setState((state) => update(state, {currentSelection: {$set: newSelection}}));
  };

  const onRemoveAnnotation = async (nodeId: number, annotationId: number): Promise<void> => executeMutation(
    () => deleteAnnotation({variables: {username, exerciseId, userSolutionNodeId: nodeId, annotationId}}),
    () => setState((state) =>
      update(state, {userSolution: {[nodeId]: {annotations: {$apply: (annotations: AnnotationFragment[]) => annotations.filter(({id}) => id !== annotationId)}}}})
    )
  );

  // Edit matches

  const onDeleteMatch = (sampleNodeId: number, userNodeId: number): Promise<void> => executeMutation(
    () => deleteMatch({variables: {exerciseId, username, sampleNodeId, userNodeId}}),
    ({exerciseMutations}) =>
      exerciseMutations.userSolution.node.deleteMatch && setState((state) => update(state, {
        currentSelection: {$set: undefined},
        matches: (ms) => ms.filter(({sampleValue, userValue}) => sampleValue !== sampleNodeId || userValue !== userNodeId)
      }))
  );

  const onFinishCorrection = async (): Promise<void> => {
    if (state.correctionSummary === undefined) {
      return;
    }

    await executeMutation(
      () => finishCorrection({variables: {exerciseId, username}}),
      ({exerciseMutations}) => /* FIXME: implement! */ console.info(JSON.stringify(exerciseMutations.userSolution.finishCorrection))
    );
  };

  const matchEditData = getMatchEditData(state, sampleSolution, onDeleteMatch);

  // comment & points

  const onNewCorrectionSummary = (newSummary: CorrectionSummaryFragment): void => setState((state) => update(state, {correctionSummary: {$set: newSummary}}));

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 gap-2">

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          {getFlatSolutionNodeChildren(sampleSolution, null).map((sampleRoot) =>
            <SampleSolutionNodeDisplay key={sampleRoot.id} matches={state.matches} currentNode={sampleRoot} allNodes={sampleSolution}
              selectedNodeId={getMarkedNodeIdProps(SideSelector.Sample)} dragProps={dragProps} depth={0} parentMatched={true}
              onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)} matchEditData={matchEditData}/>)}
        </section>

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          {getFlatSolutionNodeChildren(state.userSolution, null).map((userRoot) =>
            <UserSolutionNodeDisplay key={userRoot.id} matches={state.matches} currentNode={userRoot} allNodes={state.userSolution} depth={0}
              selectedNodeId={getMarkedNodeIdProps(SideSelector.User)} dragProps={dragProps} onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
              currentSelection={state.currentSelection} annotationEditingProps={{onCancelAnnotationEdit, onUpdateAnnotation, onSubmitAnnotation}}
              onEditAnnotation={onEditAnnotation} onRemoveAnnotation={onRemoveAnnotation} matchEditData={matchEditData}/>)}
        </section>

      </div>

      <div className="container mx-auto">
        <EditCorrectionSummary exerciseId={exerciseId} username={username} initialValues={state.correctionSummary} setKeyHandlingEnabled={setKeyHandlingEnabled}
          onUpdated={onNewCorrectionSummary}/>

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full disabled:opacity-50" onClick={onFinishCorrection}
          disabled={state.correctionSummary === undefined}>
          {t('finishCorrection')}
        </button>
      </div>
    </div>
  );
}
