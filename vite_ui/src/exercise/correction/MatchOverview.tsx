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
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
}

export interface MatchEditFuncs extends ParCitAnnoEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
  // paragraph citation
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  // edit explanation annotation
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onSubmitExplanationAnnotation: (sampleNodeId: number, userNodeId: number, newText: string) => Promise<void>;
  onUpdateExplanationAnnotation: (sampleNodeId: number, userNodeId: number, newText: string) => Promise<void>;
}

interface IProps extends MatchEditFuncs {
  exerciseId: number;
  username: string;
  match: SolutionNodeMatchFragment;
}

export function MatchOverview({
  exerciseId,
  username,
  match,
  setKeyHandlingEnabled,
  onDeleteMatch,
  onUpdateExplanationCorrectness,
  onUpdateParagraphCitationCorrectness,
  // paragraph citation annotations
  onSubmitParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
  onUpdateParagraphCitationAnnotation,
  // explanation annotation
  onSubmitExplanationAnnotation,
  onUpdateExplanationAnnotation
}: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [isAddingExplanationAnnotation, setIsAddingExplanationAnnotation] = useState(false);

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, paragraphCitationAnnotations, explanationCorrectness, explanationAnnotation } = match;

  const backgroundColor = allMatchColors[sampleNodeId];

  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(explanationCorrectness));

  const deleteMatch = () => confirm(t('reallyDeleteThisMatch')) && onDeleteMatch(sampleNodeId, userNodeId);

  const submitExplanationAnnotation = async (newText: string) => onSubmitExplanationAnnotation(sampleNodeId, userNodeId, newText);

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2 items-start">
      <div className="flex-grow space-y-2">
        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            <ParagraphCitationAnnotationsView {...{
              exerciseId, username, sampleNodeId, userNodeId, paragraphCitationAnnotations, setKeyHandlingEnabled, onSubmitParagraphCitationAnnotation,
              onDeleteParagraphCitationAnnotation, onUpdateParagraphCitationAnnotation
            }} />
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            {explanationAnnotation
              ? <ExplanationAnnotationView {...{ explanationAnnotation, setKeyHandlingEnabled }} onUpdate={(newText) => onUpdateExplanationAnnotation(sampleNodeId, userNodeId, newText)} />
              : isAddingExplanationAnnotation
                ? <ExplanationAnnotationForm initialText={''} setKeyHandlingEnabled={setKeyHandlingEnabled} onUpdate={submitExplanationAnnotation} onCancel={() => setIsAddingExplanationAnnotation(false)} />
                : <button type="button" className=" text-blue-500 font-bold" onClick={() => setIsAddingExplanationAnnotation(true)}><PlusIcon /></button>}
          </div>
        </div>
      </div>

      <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')} onClick={deleteMatch}><DeleteIcon /></button>
    </div>
  );
}
