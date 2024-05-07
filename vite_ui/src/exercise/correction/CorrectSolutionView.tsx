import {
  AnnotationFragment,
  AnnotationInput,
  CorrectionSummaryFragment,
  Correctness,
  ErrorType,
  FlatUserSolutionNodeFragment,
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
  useCreateParagraphCitationAnnotationMutation
} from '../../graphql';
import { readSelection } from '../shortCutHelper';
import { useTranslation } from 'react-i18next';
import { ReactElement, useEffect, useState } from 'react';
import { CorrectionSampleNodeDisplay } from './CorrectionSampleNodeDisplay';
import { annotationInput, CreateOrEditAnnotationData, createOrEditAnnotationData, CurrentSelection, matchSelection } from '../currentSelection';
import { MyOption } from '../../funcProg/option';
import { CorrectionUserNodeDisplay } from './CorrectionUserNodeDisplay';
import { executeMutation } from '../../mutationHelpers';
import { EditCorrectionSummary } from './EditCorrectionSummary';
import { SideSelector } from '../SideSelector';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { isDefined } from '../../funcs';
import { ParCitAnnoKey } from './ParagraphCitationAnnotationsView';
import update, { Spec } from 'immutability-helper';

interface IProps {
  username: string;
  exerciseId: number;
  sampleSolution: SolutionNodeFragment[];
  initialUserSolution: UserSolutionFragment;
}

export interface CorrectSolutionViewState {
  keyHandlingEnabled: boolean;
  userSolutionNodes: FlatUserSolutionNodeFragment[];
  matches: SolutionNodeMatchFragment[];
  correctionSummary?: CorrectionSummaryFragment | undefined | null;
  currentSelection?: CurrentSelection;
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
  const [submitParagraphCitationAnnotation] = useCreateParagraphCitationAnnotationMutation();
  const [updateParagraphCitation] = useUpdateParagraphCitationAnnotationMutation();
  const [deleteParagraphCitationAnnotation] = useDeleteParagraphCitationAnnotationMutation();
  const [updateParagraphCitationCorrectness] = useUpdateParagraphCitationCorrectnessMutation();
  const [updateExplanationCorrectness] = useUpdateExplanationCorrectnessMutation();

  const keyDownEventListener = (event: KeyboardEvent) => {
    if (!keyHandlingEnabled || (event.key !== 'f' && event.key !== 'm' && event.key !== 'n')) {
      return; // Currently only react to 'f', 'm' and 'n'
    }

    if (currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData') {
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

  const onNodeClick = (side: SideSelector, nodeId: number | undefined): void => setState(
    (state) => update(state, { currentSelection: { $set: nodeId !== undefined ? matchSelection(side, nodeId) : undefined } })
  );

  const onDragDrop = async (sampleValue: number, userValue: number) => executeMutation(
    () => submitNewMatch({ variables: { exerciseId, username, sampleNodeId: sampleValue, userNodeId: userValue } }),
    ({ exerciseMutations }) => {
      const newMatch = exerciseMutations?.userSolution?.node?.submitMatch;

      if (newMatch) {
        const { matches/*, paragraphCitationAnnotations*/ } = newMatch;
        // FIXME: use paragraphCitationAnnotations!
        setState((state) => update(state, { matches: { $push: matches } }));
      }
    }
  );

  // annotation

  const onCancelAnnotationEdit = () => setState((state) => update(state, { keyHandlingEnabled: { $set: true }, currentSelection: { $set: undefined } }));

  // FIXME: move to AnnotationEditor.tsx!
  const onSubmitAnnotation = async (annotationInput: AnnotationInput) => {
    if (currentSelection === undefined || currentSelection._type === 'MatchSelection') {
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

  const updateParagraphCitationAnnotations = (userNodeId: number, spec: Spec<ParagraphCitationAnnotationFragment[]>) => setState((state) => update(state, {
    userSolutionNodes: (nodes) => nodes.map(
      (userNode) => userNode.id === userNodeId
        ? update(userNode, { paragraphCitationAnnotations: spec })
        : userNode
    )
  }));

  const updateParagraphCitationAnnotation = ({ sampleNodeId, userNodeId, awaitedParagraph }: ParCitAnnoKey, spec: Spec<ParagraphCitationAnnotationFragment>) =>
    updateParagraphCitationAnnotations(userNodeId, (annos) => annos.map(
      (parCitAnno) => parCitAnno.sampleNodeId === sampleNodeId && parCitAnno.userNodeId === userNodeId && parCitAnno.awaitedParagraph === awaitedParagraph
        ? update(parCitAnno, spec)
        : parCitAnno
    ));

  const onSubmitParagraphCitationAnnotation = async (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
    () => submitParagraphCitationAnnotation({ variables: { exerciseId, username, sampleNodeId, userNodeId, paragraphCitationAnnotation } }),
    ({ exerciseMutations }) => {
      const newValue = exerciseMutations?.userSolution?.node?.submitParagraphCitationAnnotation;

      if (isDefined(newValue)) {
        updateParagraphCitationAnnotations(userNodeId, { $push: [newValue] });
      }
    });

  const onUpdateParagraphCitationAnnotation = async (key: ParCitAnnoKey, paragraphCitationAnnotation: ParagraphCitationAnnotationInput) => executeMutation(
    () => updateParagraphCitation({ variables: { exerciseId, username, ...key, paragraphCitationAnnotation } }),
    ({ exerciseMutations }) => {
      const newValues = exerciseMutations?.userSolution?.node?.paragraphCitationAnnotation?.newValues;

      if (isDefined(newValues)) {
        updateParagraphCitationAnnotation(key, { $set: newValues });
      }
    });

  const onDeleteParagraphCitationAnnotation = async (key: ParCitAnnoKey) => executeMutation(
    () => deleteParagraphCitationAnnotation({ variables: { exerciseId, username, ...key } }),
    ({ exerciseMutations }) => {
      const deleted = exerciseMutations?.userSolution?.node?.paragraphCitationAnnotation?.delete;

      if (isDefined(deleted)) {
        updateParagraphCitationAnnotations(key.userNodeId, (annos) => annos.filter(
          (anno) => anno.sampleNodeId !== deleted.sampleNodeId && anno.userNodeId !== deleted.userNodeId && anno.awaitedParagraph !== deleted.awaitedParagraph)
        );
      }
    }
  );

  const onUpdateParagraphCitationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => executeMutation(
    () => updateParagraphCitationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
    ({ exerciseMutations }) => {
      const newParagraphCitationCorrectness = exerciseMutations?.userSolution?.node?.match?.newParagraphCitationCorrectness;

      if (isDefined(newParagraphCitationCorrectness)) {
        updateMatchInState(sampleNodeId, userNodeId, { paragraphCitationCorrectness: { $set: newParagraphCitationCorrectness } });
      }
    });

  const onUpdateExplanationCorrectness = async (sampleNodeId: number, userNodeId: number, newCorrectness: Correctness) => executeMutation(
    () => updateExplanationCorrectness({ variables: { exerciseId, username, sampleNodeId, userNodeId, newCorrectness } }),
    ({ exerciseMutations }) => {
      const newExplanationCorrectness = exerciseMutations?.userSolution?.node?.match?.newExplanationCorrectness;

      if (isDefined(newExplanationCorrectness)) {
        updateMatchInState(sampleNodeId, userNodeId, { explanationCorrectness: { $set: newExplanationCorrectness } });
      }
    });

  const onNewCorrectionSummary = (newSummary: CorrectionSummaryFragment): void => setState((state) => update(state, { correctionSummary: { $set: newSummary } }));

  return (
    <div className="px-4 py-2">

      <div className="grid grid-cols-3 gap-2">
        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={true} allNodes={sampleSolution} allMatches={matches}>
            {(props) => <CorrectionSampleNodeDisplay {...props} onDragDrop={onDragDrop} onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)} />}
          </RecursiveSolutionNodeDisplay>
        </section>

        <section className="col-span-2 px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={false} allNodes={userSolutionNodes} allMatches={matches}>
            {(props) => <CorrectionUserNodeDisplay {...props} annotationEditingProps={{ onCancelAnnotationEdit, onSubmitAnnotation }}
              onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
              {...{
                currentSelection, setKeyHandlingEnabled, onDragDrop, onDeleteMatch, onEditAnnotation, onRemoveAnnotation, onSubmitParagraphCitationAnnotation,
                onUpdateParagraphCitationAnnotation, onDeleteParagraphCitationAnnotation, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness
              }} />}
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
