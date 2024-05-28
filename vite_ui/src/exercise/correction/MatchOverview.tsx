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
  parCitAnnoEditFuncs: ParagraphCitationAnnotationsEditFuncs | undefined;
  explAnnoEditFuncs: ExplanationAnnotationsEditFuncs | undefined;
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

interface IProps extends MatchEditFuncs {
  match: SolutionNodeMatchFragment;
}

export function MatchOverview({
  match,
  setKeyHandlingEnabled,
  onDeleteMatch,
  parCitAnnoEditFuncs,
  explAnnoEditFuncs
}: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, paragraphCitationAnnotations, explanationCorrectness, explanationAnnotations } = match;

  const deleteMatch = () => confirm(t('reallyDeleteThisMatch')) && onDeleteMatch(sampleNodeId, userNodeId);

  const allParCitAnnoEditFuncs = isDefined(parCitAnnoEditFuncs)
    ? extendParCitAnnoFuncs(sampleNodeId, userNodeId, setKeyHandlingEnabled, parCitAnnoEditFuncs)
    : undefined;

  const allExplAnnoEditFuncs = isDefined(explAnnoEditFuncs)
    ? extendExplAnnoFuncs(sampleNodeId, userNodeId, setKeyHandlingEnabled, explAnnoEditFuncs)
    : undefined;

  return (
    <div style={{ backgroundColor: allMatchColors[sampleNodeId] }} className="p-2 rounded flex flex-row space-x-2 items-start">
      <div className="flex-grow space-y-2">
        <ParagraphCitationAnnotationsView correctness={paragraphCitationCorrectness} annotations={paragraphCitationAnnotations} allEditFuncs={allParCitAnnoEditFuncs} />

        <ExplanationAnnotationsEditView  {...{ correctness: explanationCorrectness, annotations: explanationAnnotations }} allEditFuncs={allExplAnnoEditFuncs} />
      </div>

      <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')} onClick={deleteMatch}><DeleteIcon /></button>
    </div>
  );
}
