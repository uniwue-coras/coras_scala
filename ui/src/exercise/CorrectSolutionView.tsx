import {
  AnnotationFragment,
  AnnotationInput,
  ErrorType,
  FlatUserSolutionNodeFragment,
  IFlatSolutionNodeFragment,
  SolutionNodeMatchFragment,
  useDeleteAnnotationMutation,
  useDeleteMatchMutation,
  useFinishCorrectionMutation,
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
import {MatchEditData} from './MatchEdit';
import {UserSolutionNodeDisplay} from './UserSolutionNodeDisplay';
import {DragStatusProps, getFlatSolutionNodeChildren} from './BasicNodeDisplay';
import {MarkedNodeIdProps} from './selectionState';
import {executeMutation} from '../mutationHelpers';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: IFlatSolutionNodeFragment[];
  initialUserSolution: FlatUserSolutionNodeFragment[];
  initialMatches: SolutionNodeMatchFragment[];
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

interface IState {
  userSolution: FlatUserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
}

function getMatchEditData(state: IState, sampleSolution: IFlatSolutionNodeFragment[], onDeleteMatch: (sampleValue: number, userValue: number) => void): MatchEditData | undefined {
  if (state.currentSelection === undefined || state.currentSelection._type !== 'MatchSelection') {
    return undefined;
  }

  const {matches: allMatches, currentSelection: {side: markedNodeSide, nodeId}} = state;

  const markedNode = markedNodeSide === SideSelector.Sample
    ? sampleSolution.find(({id}) => id === nodeId)
    : state.userSolution.find(({id}) => id === nodeId);

  if (markedNode === undefined) {
    return undefined;
  }

  const matches: [SolutionNodeMatchFragment, IFlatSolutionNodeFragment][] = allMatches
    .filter(({sampleValue, userValue}) => nodeId === (markedNodeSide === SideSelector.Sample ? sampleValue : userValue))
    .flatMap((aMatch) => {
      const matchedNode = markedNodeSide === SideSelector.Sample
        ? state.userSolution.find(({id}) => id === aMatch.userValue)
        : sampleSolution.find(({id}) => id === aMatch.sampleValue);

      return matchedNode !== undefined
        ? [[aMatch, matchedNode]]
        : [];
    });

  if (matches.length === 0) {
    return undefined;
  }

  return {markedNodeSide, markedNode, matches, onDeleteMatch};
}

export function CorrectSolutionView({username, exerciseId, sampleSolution, initialUserSolution, initialMatches}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({userSolution: initialUserSolution, matches: initialMatches});

  const [submitNewMatch] = useSubmitNewMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();
  const [upsertAnnotation] = useUpsertAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();
  const [finishCorrection] = useFinishCorrectionMutation();

  const keyDownEventListener = (event: KeyboardEvent): void => {
    if (state.currentSelection !== undefined && (state.currentSelection._type === 'CreateOrEditAnnotationData')) {
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
      setTimeout(() => {
          disableKeyDownEventListener();
          setState((state) => update(state, {currentSelection: {$set: annotation}}));
        },
        100
      );
    }
  };

  const enableKeyDownEventListener = () => addEventListener('keydown', keyDownEventListener);
  const disableKeyDownEventListener = () => removeEventListener('keydown', keyDownEventListener);

  useEffect(() => {
    enableKeyDownEventListener();
    return disableKeyDownEventListener;
  });

  const onNodeClick = (side: SideSelector, nodeId: number | undefined): void => {
    const matchSelect = nodeId !== undefined
      ? matchSelection(side, nodeId)
      : undefined;

    setState((state) => update(state, {currentSelection: {$set: matchSelect}}));
  };

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
    enableKeyDownEventListener();
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

  const onEditAnnotation = (nodeId: number, annotationId: number): void =>
    MyOption.of(state.userSolution.find(({id}) => id === nodeId)).handle((node) => {

        MyOption.of(node.annotations.find(({id}) => id === annotationId)).handle(
          ({errorType, importance, startIndex, endIndex, text}) => {
            const newSelection = createOrEditAnnotationData(
              nodeId,
              annotationId,
              annotationInput(errorType, importance, startIndex, endIndex, text),
              node.text.length
            );

            setState((state) => update(state, {currentSelection: {$set: newSelection}}));
          },
          () => void 0);
      },
      () => void 0);

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

  const onFinishCorrection = (): Promise<void> => executeMutation(
    () => finishCorrection({variables: {exerciseId, username}}),
    ({exerciseMutations}) => /* FIXME: implement! */ console.info(JSON.stringify(exerciseMutations.userSolution.finishCorrection))
  );

  const matchEditData = getMatchEditData(state, sampleSolution, onDeleteMatch);

  if (matchEditData) {
    console.info(matchEditData);
  }

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

      <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full" onClick={onFinishCorrection}>{t('finishCorrection')}</button>
    </div>
  );
}
