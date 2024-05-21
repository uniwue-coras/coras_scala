import { ReactElement, useState } from 'react';
import { Correctness, ParagraphCitationAnnotationInput, SolutionNodeMatchFragment } from '../../graphql';
import { allMatchColors } from '../../allMatchColors';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { nextCorrectness } from '../../correctness';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, PlusIcon } from '../../icons';
import { ParCitAnnoKey, ParagraphCitationAnnotationsView } from './ParagraphCitationAnnotationsView';
import { ExplanationAnnotationView } from './ExplanationAnnotationView';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';

export interface ParCitAnnoEditFuncs {
  onGetParagraphCitationAnnotationRecommendations: (key: ParCitAnnoKey) => Promise<string[]>;
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
}

interface ExplAnnoEditFuncs {
  onGetExplanationAnnotationRecommendations: (sampleNodeId: number, userNodeI: number) => Promise<string[]>;
  onSubmitExplanationAnnotation: (sampleNodeId: number, userNodeId: number, newText: string) => Promise<void>;
  onUpdateExplanationAnnotation: (sampleNodeId: number, userNodeId: number, newText: string) => Promise<void>;
  onDeleteExplanationAnnotation: (sampleNodeId: number, userNodeId: number) => void;
}

export interface MatchEditFuncs extends ParCitAnnoEditFuncs, ExplAnnoEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
  // paragraph citation
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  // edit explanation annotation
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;

}

interface IProps extends MatchEditFuncs {
  match: SolutionNodeMatchFragment;
}

export function MatchOverview({
  match,
  setKeyHandlingEnabled,
  onDeleteMatch,
  onUpdateExplanationCorrectness,
  onUpdateParagraphCitationCorrectness,
  // paragraph citation annotations
  onGetParagraphCitationAnnotationRecommendations,
  onSubmitParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
  onUpdateParagraphCitationAnnotation,
  // explanation annotation
  onGetExplanationAnnotationRecommendations,
  onSubmitExplanationAnnotation,
  onUpdateExplanationAnnotation,
  onDeleteExplanationAnnotation,
}: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [recommendations, setRecommendations] = useState<string[]>();

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, paragraphCitationAnnotations, explanationCorrectness, explanationAnnotation } = match;

  const backgroundColor = allMatchColors[sampleNodeId];

  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(explanationCorrectness));

  const deleteMatch = () => confirm(t('reallyDeleteThisMatch')) && onDeleteMatch(sampleNodeId, userNodeId);

  const onCreateExplanationAnnotation = async () => {
    const recommendations = await onGetExplanationAnnotationRecommendations(sampleNodeId, userNodeId);
    setRecommendations(recommendations);
  };

  const submitExplanationAnnotation = async (newText: string) => onSubmitExplanationAnnotation(sampleNodeId, userNodeId, newText);

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2 items-start">
      <div className="flex-grow space-y-2">
        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            <ParagraphCitationAnnotationsView {...{
              sampleNodeId, userNodeId, paragraphCitationAnnotations, setKeyHandlingEnabled, onGetParagraphCitationAnnotationRecommendations,
              onSubmitParagraphCitationAnnotation, onDeleteParagraphCitationAnnotation, onUpdateParagraphCitationAnnotation
            }} />
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            {explanationAnnotation
              ? <ExplanationAnnotationView {...{ explanationAnnotation, setKeyHandlingEnabled }}
                onUpdate={(newText) => onUpdateExplanationAnnotation(sampleNodeId, userNodeId, newText)}
                onDelete={() => onDeleteExplanationAnnotation(sampleNodeId, userNodeId)} />
              : recommendations
                ? <ExplanationAnnotationForm initialText={''} recommendations={recommendations} setKeyHandlingEnabled={setKeyHandlingEnabled} onUpdate={submitExplanationAnnotation} onCancel={() => setRecommendations(undefined)} />
                : <button type="button" className="text-blue-500 font-bold" onClick={onCreateExplanationAnnotation}><PlusIcon /></button>}
          </div>
        </div>
      </div>

      <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')} onClick={deleteMatch}><DeleteIcon /></button>
    </div>
  );
}
