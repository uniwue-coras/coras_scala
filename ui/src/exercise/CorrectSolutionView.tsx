import {
  AnnotationFragment,
  AnnotationInput,
  ErrorType,
  FlatSolutionNodeFragment,
  FlatUserSolutionNodeFragment,
  SolutionNodeMatchFragment,
  useDeleteAnnotationMutation,
  useSubmitNewMatchMutation,
  useUpsertAnnotationMutation
} from '../graphql';
import {colors, IColor} from '../colors';
import {readSelection} from './shortCutHelper';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import update, {Spec} from 'immutability-helper';
import {DragStatusProps, getFlatSolutionNodeChildren, MarkedNodeIdProps, UserSolutionNodeDisplay} from './UserSolutionNodeDisplay';
import {SampleSolutionNodeDisplay} from './SampleSolutionNodeDisplay';
import {annotationInput, createOrEditAnnotationData, CurrentSelection, MatchSelection, matchSelection} from './currentSelection';
import {MyOption} from '../funcProg/option';

export interface ColoredMatch extends SolutionNodeMatchFragment {
  color: IColor;
}

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: FlatSolutionNodeFragment[];
  initialUserSolution: FlatUserSolutionNodeFragment[];
  initialMatches: SolutionNodeMatchFragment[];
}

export const enum SideSelector {
  Sample = 'sample',
  User = 'user'
}

interface IState {
  userSolution: FlatUserSolutionNodeFragment[];
  matches: ColoredMatch[];
  remainingColors: IColor[];
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
}

function initialState(
  userSolution: FlatUserSolutionNodeFragment[],
  initialMatches: SolutionNodeMatchFragment[]
): IState {
  const [matches, remainingColors] = initialMatches.reduce<[ColoredMatch[], IColor[]]>(
    ([matches, [color, ...remainingColors]], currentMatch) => {
      return [[{color, ...currentMatch}, ...matches], remainingColors];
    },
    [[], colors]
  );

  return {userSolution, matches, remainingColors};
}

export function CorrectSolutionView({username, exerciseId, sampleSolution, initialUserSolution, initialMatches}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>(initialState(initialUserSolution, initialMatches));

  const [submitNewMatch] = useSubmitNewMatchMutation();
  const [upsertAnnotation] = useUpsertAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

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
    onDrop: async (sampleValue: number, userValue: number): Promise<void> => {

      const result = await submitNewMatch({variables: {exerciseId, username, sampleNodeId: sampleValue, userNodeId: userValue}});

      if (result.data !== undefined && result.data !== null) {
        const {sampleValue, userValue, certainty, matchStatus} = result.data.exerciseMutations.userSolution.node.matchWithSampleNode;

        // FIXME: get colors!
        setState((state) => {
          const [color, ...remainingColors] = state.remainingColors;

          return update(state, {
            matches: {$push: [{sampleValue, userValue, matchStatus, certainty, color}]},
            remainingColors: {$set: remainingColors}
          });
        });
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

    const result = await upsertAnnotation({variables: {username, exerciseId, nodeId, maybeAnnotationId, annotationInput}});

    if (result.errors !== undefined) {
      alert('Errors:\n' + result.errors);
      return;
    } else if (result.data === undefined || result.data === null) {
      throw new Error('should not happen?');
    }

    const annotation: AnnotationFragment | undefined = result.data.exerciseMutations.userSolution.node.upsertAnnotation;

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
  };

  const onEditAnnotation = (nodeId: number, annotationId: number): void =>
    MyOption.of(state.userSolution.find(({id}) => id === nodeId)).handle(
      (node) => {

        MyOption.of(node.annotations.find(({id}) => id === annotationId)).handle(
          ({errorType, startIndex, endIndex, text}) => {

            const newSelection = createOrEditAnnotationData(
              nodeId,
              annotationId,
              annotationInput(errorType, startIndex, endIndex, text),
              node.text.length
            );

            setState((state) => update(state, {currentSelection: {$set: newSelection}}));
          },
          () => void 0);
      },
      () => void 0);

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
              annotationEditingProps={{onCancelAnnotationEdit, onUpdateAnnotation, onSubmitAnnotation}}
              onEditAnnotation={onEditAnnotation}
              onRemoveAnnotation={onRemoveAnnotation}/>)}
        </div>

      </section>

    </div>
  );
}
