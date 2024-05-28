import { ReactElement } from 'react';
import { Correctness, ParagraphCitationAnnotationInput, SolutionNodeMatchFragment } from '../../graphql';
import { allMatchColors } from '../../allMatchColors';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from '../../icons';
import { ParagraphCitationAnnotationEditFuncs, ParagraphCitationAnnotationsView } from './ParagraphCitationAnnotationsView';
import { ExplanationAnnotationEditFunctions, ExplanationAnnotationsEditView } from './ExplanationAnnotationsView';
import { isDefined } from '../../funcs';

export type ParCitAnnoKey = { sampleNodeId: number, userNodeId: number, awaitedParagraph: string };

export interface ParagraphCitationAnnotationsEditFuncs {
  updateCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  getRecommendations: (key: ParCitAnnoKey) => Promise<string[]>;
  onSubmit: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
  onUpdate: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
  onDelete: (key: ParCitAnnoKey) => void;
}

export interface ExplanationAnnotationsEditFuncs {
  updateCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  getRecommendations: (sampleNodeId: number, userNodeI: number) => Promise<string[]>;
  onSubmit: (sampleNodeId: number, userNodeId: number, text: string) => Promise<void>;
  onUpdate: (sampleNodeId: number, userNodeId: number, oldText: string, newText: string) => Promise<void>;
  onDelete: (sampleNodeId: number, userNodeId: number, text: string) => void;
}

export interface MatchEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
  parCitAnnoEditFuncs: ParagraphCitationAnnotationsEditFuncs;
  explAnnoEditFuncs: ExplanationAnnotationsEditFuncs;
}

function extendParCitAnnoFuncs(
  sampleNodeId: number,
  userNodeId: number,
  setKeyHandlingEnabled: (enabled: boolean) => void,
  { updateCorrectness, getRecommendations, onSubmit, onUpdate, onDelete }: ParagraphCitationAnnotationsEditFuncs
): ParagraphCitationAnnotationEditFuncs {
  return {
    setKeyHandlingEnabled,
    updateCorrectness: (correctness) => updateCorrectness(sampleNodeId, userNodeId, correctness),
    getRecommendations: (awaitedParagraph) => getRecommendations({ sampleNodeId, userNodeId, awaitedParagraph }),
    onSubmit: (input) => onSubmit(sampleNodeId, userNodeId, input),
    onUpdate: (awaitedParagraph, newValues) => onUpdate({ sampleNodeId, userNodeId, awaitedParagraph }, newValues),
    onDelete: (awaitedParagraph) => onDelete({ sampleNodeId, userNodeId, awaitedParagraph })
  };
}

function extendExplAnnoFuncs(
  sampleNodeId: number,
  userNodeId: number,
  setKeyHandlingEnabled: (enabled: boolean) => void,
  { updateCorrectness, getRecommendations, onSubmit, onUpdate, onDelete }: ExplanationAnnotationsEditFuncs
): ExplanationAnnotationEditFunctions {
  return {
    setKeyHandlingEnabled,
    updateCorrectness: (correctness) => updateCorrectness(sampleNodeId, userNodeId, correctness),
    getRecommendations: () => getRecommendations(sampleNodeId, userNodeId),
    onSubmit: (text) => onSubmit(sampleNodeId, userNodeId, text),
    onUpdate: (oldText, newText) => onUpdate(sampleNodeId, userNodeId, oldText, newText),
    onDelete: (text) => onDelete(sampleNodeId, userNodeId, text)
  };
}

interface IProps {
  match: SolutionNodeMatchFragment;
  editFuncs: MatchEditFuncs | undefined;
}

export function MatchOverview({ match, editFuncs }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, paragraphCitationAnnotations, explanationCorrectness, explanationAnnotations } = match;

  let allParCitAnnoEditFuncs = undefined;
  let allExplAnnoEditFuncs = undefined;

  if (isDefined(editFuncs)) {
    const { setKeyHandlingEnabled, parCitAnnoEditFuncs, explAnnoEditFuncs } = editFuncs;

    allParCitAnnoEditFuncs = extendParCitAnnoFuncs(sampleNodeId, userNodeId, setKeyHandlingEnabled, parCitAnnoEditFuncs);
    allExplAnnoEditFuncs = extendExplAnnoFuncs(sampleNodeId, userNodeId, setKeyHandlingEnabled, explAnnoEditFuncs);
  }

  const paragraphCitationsInformationPresent = paragraphCitationCorrectness !== Correctness.Unspecified || paragraphCitationAnnotations.length > 0;
  const explanationInformationPresent = explanationCorrectness !== Correctness.Unspecified || explanationAnnotations.length > 0;

  if (!isDefined(editFuncs) && !paragraphCitationsInformationPresent && !explanationInformationPresent) {
    // Hide if no information...
    return <></>;
  }

  return (
    <div style={{ backgroundColor: allMatchColors[sampleNodeId] }} className="p-2 rounded flex flex-row space-x-2 items-start">
      <div className="flex-grow space-y-2">
        {(isDefined(editFuncs) || paragraphCitationsInformationPresent) && <ParagraphCitationAnnotationsView correctness={paragraphCitationCorrectness} annotations={paragraphCitationAnnotations} allEditFuncs={allParCitAnnoEditFuncs} />}

        {(isDefined(editFuncs) || explanationInformationPresent) && <ExplanationAnnotationsEditView correctness={explanationCorrectness} annotations={explanationAnnotations} allEditFuncs={allExplAnnoEditFuncs} />}
      </div>

      {isDefined(editFuncs) && <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')}
        onClick={() => editFuncs.onDeleteMatch(sampleNodeId, userNodeId)}><DeleteIcon /></button>}
    </div>
  );
}
