import {
  AnnotationFragment,
  AnnotationInput,
  CorrectionSummaryFragment,
  Correctness,
  ErrorType,
  UserSolutionNodeFragment,
  ParagraphCitationAnnotationFragment,
  SolutionNodeFragment,
  SolutionNodeMatchFragment,
  useDeleteAnnotationMutation,
  useDeleteMatchMutation,
  useFinishCorrectionMutation,
  UserSolutionFragment,
  useSubmitNewMatchMutation,
  useUpdateExplanationCorrectnessMutation,
  useUpdateParagraphCitationCorrectnessMutation,
  useUpsertAnnotationMutation,
  useDeleteParagraphCitationAnnotationMutation,
  ParagraphCitationAnnotationInput,
  useUpdateParagraphCitationAnnotationMutation,
  useCreateParagraphCitationAnnotationMutation,
  useUpdateExplanationAnnotationMutation,
  useSubmitExplanationAnnotationMutation,
  useGetParagraphCitationAnnotationTextRecommendationsLazyQuery,
  useDeleteExplanationAnnotationMutation,
  useGetExplanationAnnotationTextRecommendationsLazyQuery
} from '../../graphql';
import { readSelection } from '../shortCutHelper';
import { useTranslation } from 'react-i18next';
import { ReactElement, useEffect, useState } from 'react';
import { annotationInput, CreateOrEditAnnotationData, createOrEditAnnotationData } from '../currentSelection';
import { MyOption } from '../../funcProg/option';
import { CorrectionUserNodeDisplay } from './CorrectionUserNodeDisplay';
import { executeMutation } from '../../mutationHelpers';
import { EditCorrectionSummary } from './EditCorrectionSummary';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { isDefined } from '../../funcs';
import { ParCitAnnoKey } from './ParagraphCitationAnnotationsView';
import { MatchEditFuncs } from './MatchOverview';
import { FlatNodeText } from '../FlatNodeText';
import update, { Spec } from 'immutability-helper';
import classNames from 'classnames';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: SolutionNodeFragment[];
  initialUserSolution: UserSolutionFragment;
}

export interface CorrectSolutionViewState {
  keyHandlingEnabled: boolean;
  userSolutionNodes: UserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  correctionSummary?: CorrectionSummaryFragment | undefined | null;
  currentSelection?: CreateOrEditAnnotationData;
}

export function CorrectSolutionView({ username, exerciseId, sampleSolution, initialUserSolution }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [{ keyHandlingEnabled, matches, userSolutionNodes, correctionSummary, currentSelection }, setState] = useState<CorrectSolutionViewState>({
    keyHandlingEnabled: true,
    ...initialUserSolution
  });

  const setKeyHandlingEnabled = (keyHandlingEnabled: boolean) => setState((state) => update(state, { keyHandlingEnabled: { $set: keyHandlingEnabled } }));

  // Mutations...
  const [submitNewMatch] = useSubmitNewMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();
  const [upsertAnnotation] = useUpsertAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();
  const [finishCorrection] = useFinishCorrectionMutation();

  // paragraph citations
  const [getParagraphCitationAnnotationRecommendations] = useGetParagraphCitationAnnotationTextRecommendationsLazyQuery();
  const [submitParagraphCitationAnnotation] = useCreateParagraphCitationAnnotationMutation();
  const [updateParagraphCitation] = useUpdateParagraphCitationAnnotationMutation();
  const [deleteParagraphCitationAnnotation] = useDeleteParagraphCitationAnnotationMutation();
  const [updateParagraphCitationCorrectness] = useUpdateParagraphCitationCorrectnessMutation();

  // explanations
  const [getExplanationAnnotationRecommendations] = useGetExplanationAnnotationTextRecommendationsLazyQuery();
  const [updateExplanationCorrectness] = useUpdateExplanationCorrectnessMutation();
  const [submitExplanationAnnotation] = useSubmitExplanationAnnotationMutation();
  const [updateExplanationAnnotation] = useUpdateExplanationAnnotationMutation();
  const [deleteExplanationAnnotation] = useDeleteExplanationAnnotationMutation();

  const keyDownEventListener = (event: KeyboardEvent) => {
    if (!keyHandlingEnabled || (event.key !== 'f' && event.key !== 'm' && event.key !== 'n')) {
      return; // Currently only react to 'f', 'm' and 'n'
    }

    if (currentSelection !== undefined) {
      return; // disable if already creating or editing annotation
    }

    const errorType = {
      'f': ErrorType.Wrong,
      'm': ErrorType.Missing,
      'n': ErrorType.Neutral
    }[event.key];

    const annotation: CreateOrEditAnnotationData | undefined = readSelection(errorType);

    if (annotation === undefined) {
      return;
    }

    setState((state) => update(state, { keyHandlingEnabled: { $set: false }, currentSelection: { $set: annotation } }));
  };

  useEffect(() => {
    addEventListener('keyup', keyDownEventListener);
    return () => removeEventListener('keyup', keyDownEventListener);
  });

  const onDragDrop = async (sampleValue: number, userValue: number) => executeMutation(
    () => submitNewMatch({ variables: { exerciseId, username, sampleNodeId: sampleValue, userNodeId: userValue } }),
    ({ exerciseMutations }) => {
      const newMatches = exerciseMutations?.userSolution?.node?.submitMatch;

      if (isDefined(newMatches)) {
        setState((state) => update(state, { matches: { $push: newMatches } }));
      }
    }
  );

  // annotation

  const onCancelAnnotationEdit = () => setState((state) => update(state, { keyHandlingEnabled: { $set: true }, currentSelection: { $set: undefined } }));

  // FIXME: move to AnnotationEditor.tsx!
  const onSubmitAnnotation = async (annotationInput: AnnotationInput) => {
    if (currentSelection === undefined) {
      return;
    }

    const { nodeId, maybeAnnotationId } = currentSelection;

    executeMutation(
      () => upsertAnnotation({ variables: { username, exerciseId, nodeId, maybeAnnotationId, annotationInput } }),
      ({ exerciseMutations }) => {

        if (!exerciseMutations?.userSolution?.node) {
          // Error?
          return;
        }

        const { userSolution: { node: { upsertAnnotation: annotation } } } = exerciseMutations;

        setState((state) => {

          const nodeIndex = state.userSolutionNodes.findIndex(({ id }) => id === nodeId);
          if (nodeIndex === -1) {
            return state;
          }

          const innerSpec = MyOption.of(maybeAnnotationId)
            .flatMap<Spec<AnnotationFragment[]>>((annotationId) => {
              const annotationIndex = state.userSolutionNodes[nodeIndex].annotations.findIndex(({ id }) => id === annotationId);

              return annotationIndex !== -1
                ? MyOption.of({ [annotationIndex]: { $set: annotation } })
                : MyOption.empty();
            })
            .getOrElse({ $push: [annotation] });

          return update(state, { userSolutionNodes: { [nodeIndex]: { annotations: innerSpec } } });
        });

        onCancelAnnotationEdit();
      }
    );
  };

  const onEditAnnotation = (nodeId: number, annotationId: number) => {

    const node = userSolutionNodes.find(({ id }) => id === nodeId);
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

  const onRemoveAnnotation = async (userSolutionNodeId: number, annotationId: number) => executeMutation(
    () => deleteAnnotation({ variables: { username, exerciseId, userSolutionNodeId, annotationId } }),
    () => setState((state) =>
      update(state, { userSolutionNodes: { [userSolutionNodeId]: { annotations: (annos) => annos.filter(({ id }) => id !== annotationId) } } })
    )
  );

  // Edit matches

  const onDeleteMatch = (sampleNodeId: number, userNodeId: number) => executeMutation(
    () => deleteMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } }),
    ({ exerciseMutations }) => {
      const deletedMatch = exerciseMutations?.userSolution?.node?.match?.delete;

      if (isDefined(deletedMatch)) {
        setState((state) => update(state, {
          currentSelection: { $set: undefined },
          matches: (ms) => ms.filter((m) => m.sampleNodeId !== deletedMatch.sampleNodeId && m.userNodeId !== deletedMatch.userNodeId)
        }));
      }
    }
  );

  const onFinishCorrection = async (): Promise<void> => {
    if (correctionSummary === undefined) {
      return;
    }

    await executeMutation(
      () => finishCorrection({ variables: { exerciseId, username } }),
      ({ exerciseMutations }) => /* FIXME: implement! */ console.info(JSON.stringify(exerciseMutations?.userSolution?.finishCorrection))
    );
  };

  // Correctness

  const updateMatchInState = (sampleNodeId: number, userNodeId: number, spec: Spec<SolutionNodeMatchFragment>) => setState((state) => update(state, {
    matches: (ms) => ms.map((m) => m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId ? update(m, spec) : m)
  }));

  // paragraph citation annotations

  const updateParagraphCitationAnnotations = (sampleNodeId: number, userNodeId: number, spec: Spec<ParagraphCitationAnnotationFragment[]>) =>
    updateMatchInState(sampleNodeId, userNodeId, { paragraphCitationAnnotations: spec });

  const updateParagraphCitationAnnotation = ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey, spec: Spec<ParagraphCitationAnnotationFragment>) =>
    updateParagraphCitationAnnotations(sampleNodeId, userNodeId, (annos) => annos.map(
      (parCitAnno) => parCitAnno.awaitedParagraph === awaitedParagraph
        ? update(parCitAnno, spec)
        : parCitAnno
    ));

  const onGetParagraphCitationAnnotationRecommendations = async ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey): Promise<string[]> => {
    const { data } = await getParagraphCitationAnnotationRecommendations({ variables: { exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph } });
    return data?.exercise?.userSolution?.node?.match?.paragraphCitationAnnotation?.explanationRecommendations || [];
  };

  const onSubmitParagraphCitationAnnotation = async (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
    () => submitParagraphCitationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, paragraphCitationAnnotation } }),
    ({ exerciseMutations }) => {
      const newParagraphCitationAnnotation = exerciseMutations?.userSolution?.node?.match?.submitParagraphCitationAnnotation;

      isDefined(newParagraphCitationAnnotation) && updateParagraphCitationAnnotations(sampleNodeId, userNodeId, { $push: [newParagraphCitationAnnotation] });
    });

  const onUpdateParagraphCitationAnnotation = async (key: ParCitAnnoKey, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
    () => updateParagraphCitation({ variables: { exerciseId, username, ...key, paragraphCitationAnnotation } }),
    ({ exerciseMutations }) => {
      const newValues = exerciseMutations?.userSolution?.node?.match?.paragraphCitationAnnotation?.newValues;
      isDefined(newValues) && updateParagraphCitationAnnotation(key, { $set: newValues });
    });

  const onDeleteParagraphCitationAnnotation = async ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey) => executeMutation(
    () => deleteParagraphCitationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph } }),
    ({ exerciseMutations }) => {
      const deleted = exerciseMutations?.userSolution?.node?.match?.paragraphCitationAnnotation?.delete;
      isDefined(deleted) && updateParagraphCitationAnnotations(sampleNodeId, userNodeId, (annos) => annos.filter(({ awaitedParagraph }) => awaitedParagraph !== deleted.awaitedParagraph));
    }
  );

  const onUpdateParagraphCitationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => executeMutation(
    () => updateParagraphCitationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
    ({ exerciseMutations }) => {
      const newParagraphCitationCorrectness = exerciseMutations?.userSolution?.node?.match?.newParagraphCitationCorrectness;
      isDefined(newParagraphCitationCorrectness) && updateMatchInState(sampleNodeId, userNodeId, { paragraphCitationCorrectness: { $set: newParagraphCitationCorrectness } });
    });

  // explanation annotation

  const onGetExplanationAnnotationRecommendations = async (sampleNodeId: number, userNodeId: number) => {
    const { data } = await getExplanationAnnotationRecommendations({ variables: { exerciseId, username, sampleNodeId, userNodeId } });
    return data?.exercise?.userSolution?.node?.match?.explanationAnnotationRecommendations || [];
  };

  const onUpdateExplanationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => executeMutation(
    () => updateExplanationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
    ({ exerciseMutations }) => {
      const newExplanationCorrectness = exerciseMutations?.userSolution?.node?.match?.newExplanationCorrectness;
      isDefined(newExplanationCorrectness) && updateMatchInState(sampleNodeId, userNodeId, { explanationCorrectness: { $set: newExplanationCorrectness } });
    });

  const onSubmitExplanationAnnotation = async (sampleNodeId: number, userNodeId: number, text: string) => executeMutation(
    () => submitExplanationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, text } }),
    ({ exerciseMutations }) => {
      const newExplanationAnnotation = exerciseMutations?.userSolution?.node?.match?.submitExplanationAnnotation;
      isDefined(newExplanationAnnotation) && updateMatchInState(sampleNodeId, userNodeId, { explanationAnnotation: { $set: newExplanationAnnotation } });
    }
  );

  const onUpdateExplanationAnnotation = async (sampleNodeId: number, userNodeId: number, text: string) => executeMutation(
    () => updateExplanationAnnotation({ variables: { username, exerciseId, sampleNodeId, userNodeId, text } }),
    ({ exerciseMutations }) => {
      const newText = exerciseMutations?.userSolution?.node?.match?.explanationAnnotation?.edit;
      isDefined(newText) && updateMatchInState(sampleNodeId, userNodeId, { explanationAnnotation: { annotation: { $set: newText } } });
    }
  );

  const onDeleteExplanationAnnotation = (sampleNodeId: number, userNodeId: number) => executeMutation(
    () => deleteExplanationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId } }),
    ({ exerciseMutations }) => {
      const deleted = exerciseMutations?.userSolution?.node?.match?.explanationAnnotation?.delete;
      isDefined(deleted) && updateMatchInState(sampleNodeId, userNodeId, { explanationAnnotation: { $set: undefined } });
    }
  );

  const onNewCorrectionSummary = (newSummary: CorrectionSummaryFragment): void => setState((state) => update(state, { correctionSummary: { $set: newSummary } }));

  const matchEditFuncs: MatchEditFuncs = {
    setKeyHandlingEnabled,
    onDeleteMatch,
    // paragraph citations
    onGetParagraphCitationAnnotationRecommendations,
    onUpdateParagraphCitationCorrectness,
    onSubmitParagraphCitationAnnotation,
    onUpdateParagraphCitationAnnotation,
    onDeleteParagraphCitationAnnotation,
    // explanations
    onGetExplanationAnnotationRecommendations,
    onUpdateExplanationCorrectness,
    onSubmitExplanationAnnotation,
    onUpdateExplanationAnnotation,
    onDeleteExplanationAnnotation
  };

  return (
    <div className="px-4 py-2">

      <div className="grid grid-cols-3 gap-2">
        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={true} allNodes={sampleSolution} allMatches={matches}>
            {({ node, ownMatches, ...otherProps }) =>
              <div className={classNames({ 'p-2 rounded border-2 border-red-600 text-red-600': !node.isSubText && ownMatches.length === 0 })}>
                <FlatNodeText isSample={true} {...{ node, ownMatches, onDragDrop }} {...otherProps} />
              </div>}
          </RecursiveSolutionNodeDisplay>
        </section>

        <section className="col-span-2 px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={false} allNodes={userSolutionNodes} allMatches={matches}>
            {(props) => <CorrectionUserNodeDisplay {...props} annotationEditingProps={{ onCancelAnnotationEdit, onSubmitAnnotation }}
              {...{ exerciseId, username, matchEditFuncs, currentSelection, onDragDrop, onDeleteMatch, onEditAnnotation, onRemoveAnnotation }} />}
          </RecursiveSolutionNodeDisplay>
        </section>
      </div>

      <div className="container mx-auto">
        <EditCorrectionSummary {...{ exerciseId, username, setKeyHandlingEnabled, onNewCorrectionSummary }} initialValues={correctionSummary} />

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full disabled:opacity-50" onClick={onFinishCorrection} disabled={correctionSummary === undefined}>
          {t('finishCorrection')}
        </button>
      </div>
    </div>
  );
}
