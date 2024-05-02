import { ReactElement } from 'react';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { Correctness, SolutionNodeMatchFragment } from '../../graphql';
import { nextCorrectness } from '../../correctness';
import { allMatchColors } from '../../allMatchColors';
import { DeleteIcon } from '../../icons';
import { useTranslation } from 'react-i18next';

interface IProps {
  match: SolutionNodeMatchFragment;
  onDeleteMatch: (sampleNodeId: number, userNodeId: number) => void;
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
}

export function MatchCorrectnessSignals({ match, onDeleteMatch, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness } = match;
  const backgroundColor = allMatchColors[sampleNodeId];

  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(explanationCorrectness));

  const deleteMatch = () => confirm(t('reallyDeleteThisMatch')) && onDeleteMatch(sampleNodeId, userNodeId);

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2">
      <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />
      <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />
      <button type="button" className="px-4 py-2 rounded bg-white text-red-600 font-bold" title={t('deleteMatch')} onClick={deleteMatch}><DeleteIcon /></button>
    </div>
  );
}
