import {
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
  useUpdateAnnotationMutation,
  useDeleteParagraphCitationAnnotationMutation,
  ParagraphCitationAnnotationInput,
  useUpdateParagraphCitationAnnotationMutation,
  useCreateParagraphCitationAnnotationMutation,
  useUpdateExplanationAnnotationMutation,
  useSubmitExplanationAnnotationMutation,
  useGetParagraphCitationAnnotationTextRecommendationsLazyQuery,
  useDeleteExplanationAnnotationMutation,
  useGetExplanationAnnotationTextRecommendationsLazyQuery,
  useSubmitAnnotationMutation,
  ExerciseTextBlockFragment,
} from '../../graphql';
import { readSelection } from '../shortCutHelper';
import { useTranslation } from 'react-i18next';
import { ReactElement, useEffect, useState } from 'react';
import { annotationInput, CreateOrEditAnnotationData, createOrEditAnnotationData } from '../currentSelection';
import { CorrectionUserNodeDisplay } from './CorrectionUserNodeDisplay';
import { executeMutation } from '../../mutationHelpers';
import { EditCorrectionSummary } from './EditCorrectionSummary';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { isDefined } from '../../funcs';
import { ExplanationAnnotationsEditFuncs, MatchEditFuncs, ParCitAnnoKey, ParagraphCitationAnnotationsEditFuncs } from './MatchOverview';
import { FlatNodeText } from '../FlatNodeText';
import { homeUrl } from '../../urls';
import { useNavigate } from 'react-router-dom';
import update, { Spec } from 'immutability-helper';
import classNames from 'classnames';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: SolutionNodeFragment[];
  initialUserSolution: UserSolutionFragment;
  textBlocks: ExerciseTextBlockFragment[];
}

export interface CorrectSolutionViewState {
  keyHandlingEnabled: boolean;
  userSolutionNodes: UserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  correctionSummary?: CorrectionSummaryFragment | undefined | null;
  currentSelection?: CreateOrEditAnnotationData;
}

export function CorrectSolutionView({ username, exerciseId, sampleSolution, initialUserSolution, textBlocks }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [{ keyHandlingEnabled, matches, userSolutionNodes, correctionSummary, currentSelection }, setState] = useState<CorrectSolutionViewState>({
    keyHandlingEnabled: true,
    ...initialUserSolution
  });

  const setKeyHandlingEnabled = (keyHandlingEnabled: boolean) => setState((state) => update(state, { keyHandlingEnabled: { $set: keyHandlingEnabled } }));

  // Mutations...
  const [submitNewMatch] = useSubmitNewMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();
  const [submitAnnotation] = useSubmitAnnotationMutation();
  const [updateAnnotation] = useUpdateAnnotationMutation();
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
      isDefined(newMatches) && setState((state) => update(state, { matches: { $push: newMatches } }));
    }
  );

  // annotation

  const updateUserSolutionNode = (nodeId: number, spec: Spec<UserSolutionNodeFragment>) => setState((state) => update(state, {
    userSolutionNodes: (userSolNodes) => userSolNodes.map((userSolNode) => userSolNode.id === nodeId ? update(userSolNode, spec) : userSolNode)
  }));

  const onCancelAnnotationEdit = () => setState((state) => update(state, { keyHandlingEnabled: { $set: true }, currentSelection: { $set: undefined } }));

  const onSubmitAnnotation = async (annotationInput: AnnotationInput) => {
    if (!isDefined(currentSelection)) {
      return;
    }

    const { nodeId, maybeAnnotationId } = currentSelection;

    if (isDefined(maybeAnnotationId)) {
      executeMutation(
        () => updateAnnotation({ variables: { username, exerciseId, nodeId, annotationId: maybeAnnotationId, annotationInput } }),
        ({ exerciseMutations }) => {

          const updatedAnnotation = exerciseMutations?.userSolution?.node?.annotation?.update;

          if (!isDefined(updatedAnnotation)) {
            // Error?
            return;
          }

          updateUserSolutionNode(nodeId, {
            annotations: (annotations) => annotations.map((annotation) => annotation.id === maybeAnnotationId ? updatedAnnotation : annotation)
          });

          onCancelAnnotationEdit();
        }
      );
    } else {
      executeMutation(
        () => submitAnnotation({ variables: { username, exerciseId, nodeId, annotationInput } }),
        ({ exerciseMutations }) => {

          const submittedAnnotation = exerciseMutations?.userSolution?.node?.submitAnnotation;

          if (!isDefined(submittedAnnotation)) {
            // Error?
            return;
          }

          updateUserSolutionNode(nodeId, { annotations: { $push: [submittedAnnotation] } });

          onCancelAnnotationEdit();
        }
      );
    }
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

  const onFinishCorrection = () => isDefined(correctionSummary) && executeMutation(
    () => finishCorrection({ variables: { exerciseId, username } }),
    ({ exerciseMutations }) => !!exerciseMutations?.userSolution?.finishCorrection && navigate(homeUrl)
  );

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

  const parCitAnnoEditFuncs: ParagraphCitationAnnotationsEditFuncs = {
    updateCorrectness: (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => executeMutation(
      () => updateParagraphCitationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
      ({ exerciseMutations }) => {
        const newParagraphCitationCorrectness = exerciseMutations?.userSolution?.node?.match?.newParagraphCitationCorrectness;
        isDefined(newParagraphCitationCorrectness) && updateMatchInState(sampleNodeId, userNodeId, { paragraphCitationCorrectness: { $set: newParagraphCitationCorrectness } });
      }),
    getRecommendations: async ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey): Promise<string[]> => {
      const { data } = await getParagraphCitationAnnotationRecommendations({ variables: { exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph } });
      return data?.exercise?.userSolution?.node?.match?.paragraphCitationAnnotation?.explanationRecommendations || [];
    },
    onSubmit: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
      () => submitParagraphCitationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, paragraphCitationAnnotation } }),
      ({ exerciseMutations }) => {
        const newParagraphCitationAnnotation = exerciseMutations?.userSolution?.node?.match?.submitParagraphCitationAnnotation;
        isDefined(newParagraphCitationAnnotation) && updateParagraphCitationAnnotations(sampleNodeId, userNodeId, { $push: [newParagraphCitationAnnotation] });
      }),
    onUpdate: (key: ParCitAnnoKey, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
      () => updateParagraphCitation({ variables: { exerciseId, username, ...key, paragraphCitationAnnotation } }),
      ({ exerciseMutations }) => {
        const newValues = exerciseMutations?.userSolution?.node?.match?.paragraphCitationAnnotation?.newValues;
        isDefined(newValues) && updateParagraphCitationAnnotation(key, { $set: newValues });
      }),
    onDelete: ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey) => confirm(t('reallyDeleteParagraphCitationAnnotation?')) && executeMutation(
      () => deleteParagraphCitationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, awaitedParagraph } }),
      ({ exerciseMutations }) => {
        const deleted = exerciseMutations?.userSolution?.node?.match?.paragraphCitationAnnotation?.delete;
        isDefined(deleted) && updateParagraphCitationAnnotations(sampleNodeId, userNodeId, (annos) => annos.filter(({ awaitedParagraph }) => awaitedParagraph !== deleted.awaitedParagraph));
      }
    )
  };

  // explanation annotation

  const onNewCorrectionSummary = (newSummary: CorrectionSummaryFragment): void => setState((state) => update(state, { correctionSummary: { $set: newSummary } }));

  const explAnnoEditFuncs: ExplanationAnnotationsEditFuncs = {
    updateCorrectness: (sampleNodeId, userNodeId, newCorrectness) => executeMutation(
      () => updateExplanationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
      ({ exerciseMutations }) => {
        const newExplanationCorrectness = exerciseMutations?.userSolution?.node?.match?.newExplanationCorrectness;
        isDefined(newExplanationCorrectness) && updateMatchInState(sampleNodeId, userNodeId, { explanationCorrectness: { $set: newExplanationCorrectness } });
      }),
    getRecommendations: async (sampleNodeId, userNodeId) => {
      const { data } = await getExplanationAnnotationRecommendations({ variables: { exerciseId, username, sampleNodeId, userNodeId } });
      return data?.exercise?.userSolution?.node?.match?.explanationAnnotationRecommendations || [];
    },
    onSubmit: (sampleNodeId, userNodeId, text) => executeMutation(
      () => submitExplanationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, text } }),
      ({ exerciseMutations }) => {
        const newExplanationAnnotation = exerciseMutations?.userSolution?.node?.match?.submitExplanationAnnotation;
        isDefined(newExplanationAnnotation) && updateMatchInState(sampleNodeId, userNodeId, { explanationAnnotations: { $push: [newExplanationAnnotation] } });
      }
    ),
    onUpdate: (sampleNodeId, userNodeId, oldText, text) => executeMutation(
      () => updateExplanationAnnotation({ variables: { username, exerciseId, sampleNodeId, userNodeId, oldText, text } }),
      ({ exerciseMutations }) => {
        const newText = exerciseMutations?.userSolution?.node?.match?.explanationAnnotation?.edit;
        isDefined(newText) && updateMatchInState(sampleNodeId, userNodeId, {
          explanationAnnotations: (explAnnos) => explAnnos.map((explAnno) => explAnno.text === oldText ? update(explAnno, { text: { $set: newText } }) : explAnno)
        });
      }
    ),
    onDelete: (sampleNodeId, userNodeId, text) => confirm(t('reallyDeleteExplanationAnnotation')) && executeMutation(
      () => deleteExplanationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, text } }),
      ({ exerciseMutations }) => {
        const deleted = exerciseMutations?.userSolution?.node?.match?.explanationAnnotation?.delete;
        isDefined(deleted) && updateMatchInState(sampleNodeId, userNodeId, { explanationAnnotations: (explAnnos) => explAnnos.filter((anno) => anno.text === text) });
      }
    )
  };

  const matchEditFuncs: MatchEditFuncs = {
    setKeyHandlingEnabled,
    onDeleteMatch,
    parCitAnnoEditFuncs,
    explAnnoEditFuncs
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
              {...{ matchEditFuncs, currentSelection, onDragDrop, onDeleteMatch, onEditAnnotation, onRemoveAnnotation }} />}
          </RecursiveSolutionNodeDisplay>
        </section>
      </div>

      <div className="container mx-auto">
        <EditCorrectionSummary {...{ exerciseId, username, textBlocks, setKeyHandlingEnabled, onNewCorrectionSummary }} initialValues={correctionSummary} />

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full disabled:opacity-50" onClick={onFinishCorrection} disabled={correctionSummary === undefined}>
          {t('finishCorrection')}
        </button>
      </div>
    </div>
  );
}
