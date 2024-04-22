import {
  AnnotationFragment,
  AnnotationInput,
  CorrectionSummaryFragment,
  Correctness,
  ErrorType,
  FlatUserSolutionNodeFragment,
  SolutionNodeFragment,
  SolutionNodeMatchFragment,
  useAnnotationTextRecommendationLazyQuery,
  useDeleteAnnotationMutation,
  useDeleteMatchMutation,
  useFinishCorrectionMutation,
  UserSolutionFragment,
  useSubmitNewMatchMutation,
  useUpdateCorrectnessMutation,
  useUpdateExplanationCorrectnessMutation,
  useUpdateParagraphCitationCorrectnessMutation,
  useUpsertAnnotationMutation
} from '../../graphql';
import { readSelection } from '../shortCutHelper';
import { useTranslation } from 'react-i18next';
import { ReactElement, useEffect, useState } from 'react';
import { CorrectionSampleNodeDisplay } from './CorrectionSampleNodeDisplay';
import { annotationInput, CreateOrEditAnnotationData, createOrEditAnnotationData, CurrentSelection, matchSelection } from '../currentSelection';
import { MyOption } from '../../funcProg/option';
import { CorrectionUserNodeDisplay } from './CorrectionUserNodeDisplay';
import { executeMutation } from '../../mutationHelpers';
import { getMatchEditData } from '../matchEditData';
import { EditCorrectionSummary } from './EditCorrectionSummary';
import { SideSelector } from '../SideSelector';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import update, { Spec } from 'immutability-helper';
import { isDefined } from '../../funcs';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: SolutionNodeFragment[];
  initialUserSolution: UserSolutionFragment;
}

export interface CorrectSolutionViewState {
  userSolution: FlatUserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  correctionSummary: CorrectionSummaryFragment | undefined;
  draggedSide?: SideSelector;
  currentSelection?: CurrentSelection;
}

export function CorrectSolutionView({ username, exerciseId, sampleSolution, initialUserSolution }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { nodes: initialUserNodes, matches: initialMatches, correctionSummary: initialCorrectionSummary } = initialUserSolution;

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
  const [getAnnotationTextRecommendations] = useAnnotationTextRecommendationLazyQuery();
  const [updateCorrectness] = useUpdateCorrectnessMutation();
  const [updateParagraphCitationCorrectness] = useUpdateParagraphCitationCorrectnessMutation();
  const [updateExplanationCorrectness] = useUpdateExplanationCorrectnessMutation();

  const keyDownEventListener = async (event: KeyboardEvent): Promise<void> => {
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

    const annotation: CreateOrEditAnnotationData | undefined = readSelection(errorType);

    if (annotation === undefined) {
      return;
    }

    // nodeId is userSolutionNodeId
    const { nodeId: userSolutionNodeId, annotationInput: { startIndex, endIndex } } = annotation;

    const { data } = await getAnnotationTextRecommendations({ variables: { exerciseId, username, userSolutionNodeId, startIndex, endIndex } });

    annotation.textRecommendations = data?.exercise?.userSolution?.node?.textRecommendations;

    setKeyHandlingEnabled(false);
    setState((state) => update(state, { currentSelection: { $set: annotation } }));
  };

  useEffect(() => {
    addEventListener('keyup', keyDownEventListener);
    return () => removeEventListener('keyup', keyDownEventListener);
  });

  const onNodeClick = (side: SideSelector, nodeId: number | undefined): void => setState(
    (state) => update(state, { currentSelection: { $set: nodeId !== undefined ? matchSelection(side, nodeId) : undefined } })
  );

  const onDragDrop = async (sampleValue: number, userValue: number): Promise<void> => {

    const result = await submitNewMatch({ variables: { exerciseId, username, sampleNodeId: sampleValue, userNodeId: userValue } });

    if (result.data?.exerciseMutations?.userSolution?.node) {
      const newMatch = result.data.exerciseMutations.userSolution.node.submitMatch;

      setState((state) => update(state, { matches: { $push: [newMatch] } }));
    }
  };

  // annotation

  const onCancelAnnotationEdit = () => {
    setKeyHandlingEnabled(true);
    setState((state) => update(state, { currentSelection: { $set: undefined } }));
  };

  /**
   * FIXME: move to AnnotationEditor.tsx!
   * @param annotationInput
   */
  const onSubmitAnnotation = async (annotationInput: AnnotationInput): Promise<void> => {
    if (state.currentSelection === undefined || state.currentSelection._type === 'MatchSelection') {
      return;
    }

    const { nodeId, maybeAnnotationId/*, annotationInput*/ } = state.currentSelection;

    return executeMutation(
      () => upsertAnnotation({ variables: { username, exerciseId, nodeId, maybeAnnotationId, annotationInput } }),
      ({ exerciseMutations }) => {

        if (!exerciseMutations?.userSolution?.node) {
          // Error?
          return;
        }

        const { userSolution: { node: { upsertAnnotation: annotation } } } = exerciseMutations;

        setState((state) => {

          const nodeIndex = state.userSolution.findIndex(({ id }) => id === nodeId);
          if (nodeIndex === -1) {
            return state;
          }

          const innerSpec = MyOption.of(maybeAnnotationId)
            .flatMap<Spec<AnnotationFragment[]>>((annotationId) => {
              const annotationIndex = state.userSolution[nodeIndex].annotations.findIndex(({ id }) => id === annotationId);

              return annotationIndex !== -1
                ? MyOption.of({ [annotationIndex]: { $set: annotation } })
                : MyOption.empty();
            })
            .getOrElse({ $push: [annotation] });

          return update(state, { userSolution: { [nodeIndex]: { annotations: innerSpec } } });
        });

        onCancelAnnotationEdit();
      }
    );
  };

  const onEditAnnotation = (nodeId: number, annotationId: number): void => {

    const node = state.userSolution.find(({ id }) => id === nodeId);
    if (node === undefined) {
      return;
    }

    const annotation = node.annotations.find(({ id }) => id === annotationId);
    if (annotation === undefined) {
      return;
    }

    const { errorType, importance, startIndex, endIndex, text } = annotation;
    const newSelection = createOrEditAnnotationData(nodeId, annotationId, annotationInput(errorType, importance, startIndex, endIndex, text), node.text.length);

    setState((state) => update(state, { currentSelection: { $set: newSelection } }));
  };

  const onRemoveAnnotation = async (nodeId: number, annotationId: number): Promise<void> => executeMutation(
    () => deleteAnnotation({ variables: { username, exerciseId, userSolutionNodeId: nodeId, annotationId } }),
    () => setState((state) =>
      update(state, { userSolution: { [nodeId]: { annotations: { $apply: (annotations: AnnotationFragment[]) => annotations.filter(({ id }) => id !== annotationId) } } } })
    )
  );

  // Edit matches

  const onDeleteMatch = (sampleNodeId: number, userNodeId: number): Promise<void> => executeMutation(
    () => deleteMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } }),
    ({ exerciseMutations }) =>
      exerciseMutations?.userSolution?.node?.deleteMatch && setState((state) => update(state, {
        currentSelection: { $set: undefined },
        matches: (ms) => ms.filter(({ sampleNodeId: sample, userNodeId: user }) => sampleNodeId !== sample || userNodeId !== user)
      }))
  );

  const onFinishCorrection = async (): Promise<void> => {
    if (state.correctionSummary === undefined) {
      return;
    }

    await executeMutation(
      () => finishCorrection({ variables: { exerciseId, username } }),
      ({ exerciseMutations }) => /* FIXME: implement! */ console.info(JSON.stringify(exerciseMutations?.userSolution?.finishCorrection))
    );
  };

  // Correctness

  const onUpdateCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => {
    try {
      const { data } = await updateCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } });

      const newValue = data?.exerciseMutations?.userSolution?.node?.match?.updateCorrectness;

      if (isDefined(newValue)) {
        setState((state) => update(state, {
          matches: (ms) => ms.map((m) => m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId
            ? update(m, { correctness: { $set: newValue } })
            : m
          )
        }));
      } else {
        console.warn(`Could not update correctness: ${JSON.stringify(data)}`);
      }
    } catch (exception) {
      console.error(exception);
    }
  };

  const onUpdateParagraphCitationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => {
    try {
      const { data } = await updateParagraphCitationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } });

      const newValue = data?.exerciseMutations?.userSolution?.node?.match?.updateParagraphCitationCorrectness;

      if (isDefined(newValue)) {
        setState((state) => update(state, {
          matches: (ms) => ms.map((m) => m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId
            ? update(m, { paragraphCitationCorrectness: { $set: newValue } })
            : m
          )
        }));
      } else {
        console.warn(`Could not update correctness: ${JSON.stringify(data)}`);
      }
    } catch (exception) {
      console.error(exception);
    }
  };

  const onUpdateExplanationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => {
    try {
      const { data } = await updateExplanationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } });

      const newValue = data?.exerciseMutations?.userSolution?.node?.match?.updateExplanationCorrectness;

      if (isDefined(newValue)) {
        setState((state) => update(state, {
          matches: (ms) => ms.map((m) => m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId
            ? update(m, { explanationCorrectness: { $set: newValue } })
            : m
          )
        }));
      } else {
        console.warn(`Could not update correctness: ${JSON.stringify(data)}`);
      }
    } catch (exception) {
      console.error(exception);
    }
  };

  const matchEditData = getMatchEditData(state, sampleSolution, onDeleteMatch);

  // comment & points

  const onNewCorrectionSummary = (newSummary: CorrectionSummaryFragment): void => setState((state) => update(state, { correctionSummary: { $set: newSummary } }));

  return (
    <div className="px-4 py-2">

      <div className="grid grid-cols-3 gap-2">
        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={true} allNodes={sampleSolution} allMatches={state.matches}>
            {(props) => <CorrectionSampleNodeDisplay {...props} matchEditData={matchEditData} onDragDrop={onDragDrop} onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)} />}
          </RecursiveSolutionNodeDisplay>
        </section>

        <section className="col-span-2 px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={false} allNodes={state.userSolution} allMatches={state.matches}>
            {(props) => <CorrectionUserNodeDisplay {...props} annotationEditingProps={{ onCancelAnnotationEdit, onSubmitAnnotation }}
              matchEditData={matchEditData} onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
              {...{ onDragDrop, onEditAnnotation, onRemoveAnnotation, onUpdateCorrectness, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }} />}
          </RecursiveSolutionNodeDisplay>
        </section>
      </div>

      <div className="container mx-auto">
        <EditCorrectionSummary exerciseId={exerciseId} username={username} initialValues={state.correctionSummary} setKeyHandlingEnabled={setKeyHandlingEnabled}
          onUpdated={onNewCorrectionSummary} />

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full disabled:opacity-50" onClick={onFinishCorrection}
          disabled={state.correctionSummary === undefined}>
          {t('finishCorrection')}
        </button>
      </div>
    </div>
  );
}