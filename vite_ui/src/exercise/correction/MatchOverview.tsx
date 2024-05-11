import { ReactElement } from 'react';
import { Correctness, ParagraphCitationAnnotationInput, SolutionNodeMatchFragment } from '../../graphql';
import { allMatchColors } from '../../allMatchColors';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { nextCorrectness } from '../../correctness';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, PlusIcon } from '../../icons';
import { ParCitAnnoKey, ParagraphCitationAnnotationsView } from './ParagraphCitationAnnotationsView';
import { ExplanationAnnotationView } from './ExplanationAnnotationView';

export interface ParCitAnnoEditFuncs {
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
}

export interface MatchEditFuncs extends ParCitAnnoEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;

  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;

  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;

  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onUpdateExplanationAnnotation: (sampleNodeId: number, userNodeId: number, newText: string) => Promise<void>;
}

interface IProps extends MatchEditFuncs {
  match: SolutionNodeMatchFragment
}

export function MatchOverview({
  match,
  setKeyHandlingEnabled,
  onDeleteMatch,
  onUpdateExplanationCorrectness,
  onUpdateParagraphCitationCorrectness,
  // paragraph citation annotations
  onSubmitParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
  onUpdateParagraphCitationAnnotation,
  onUpdateExplanationAnnotation
}: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, paragraphCitationAnnotations, explanationCorrectness, explanationAnnotation } = match;

  const backgroundColor = allMatchColors[sampleNodeId];

  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(explanationCorrectness));

  const deleteMatch = () => confirm(t('reallyDeleteThisMatch')) && onDeleteMatch(sampleNodeId, userNodeId);

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2 items-start">
      <div className="flex-grow space-y-2">
        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            <ParagraphCitationAnnotationsView {...{
              sampleNodeId, userNodeId, paragraphCitationAnnotations, setKeyHandlingEnabled, onSubmitParagraphCitationAnnotation,
              onDeleteParagraphCitationAnnotation, onUpdateParagraphCitationAnnotation
            }} />
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />

          <div className="flex-grow p-2 rounded bg-white">
            {explanationAnnotation
              ? <ExplanationAnnotationView explanationAnnotation={explanationAnnotation} onUpdate={(newText) => onUpdateExplanationAnnotation(sampleNodeId, userNodeId, newText)} />
              : <button type="button" className=" text-blue-500 font-bold"><PlusIcon /></button>}
          </div>
        </div>
      </div>

      <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')} onClick={deleteMatch}><DeleteIcon /></button>
    </div>
  );
}
