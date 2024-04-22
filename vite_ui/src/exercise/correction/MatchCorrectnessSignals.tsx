import { ReactElement } from 'react';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { Correctness, ISolutionNodeMatchFragment } from '../../graphql';
import { nextCorrectness } from '../../correctness';
import { allMatchColors } from '../../allMatchColors';

interface IProps {
  match: ISolutionNodeMatchFragment;
  onUpdateCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
}

export function MatchCorrectnessSignals({ match, onUpdateCorrectness, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }: IProps): ReactElement {

  const { sampleNodeId, userNodeId, correctness, paragraphCitationCorrectness, explanationCorrectness } = match;

  const backgroundColor = allMatchColors[sampleNodeId];

  const updateCorrectness = () => onUpdateCorrectness(sampleNodeId, userNodeId, nextCorrectness(correctness));
  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2">
      <CorrectnessSignal letter="&#x2BB1;" correctness={correctness} onClick={updateCorrectness} />
      <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />
      <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />
    </div>
  );
}
