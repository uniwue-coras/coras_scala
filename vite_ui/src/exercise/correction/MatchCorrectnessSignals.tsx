import { ReactElement } from 'react';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { Correctness, SolutionNodeMatchFragment } from '../../graphql';
import { nextCorrectness } from '../../correctness';
import { allMatchColors } from '../../allMatchColors';

interface IProps {
  match: SolutionNodeMatchFragment;
  onUpdateParagraphCitationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
  onUpdateExplanationCorrectness: (sampleNodeId: number, userNodeId: number, correctness: Correctness) => void;
}

export function MatchCorrectnessSignals({ match, onUpdateParagraphCitationCorrectness, onUpdateExplanationCorrectness }: IProps): ReactElement {

  const { sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness } = match;

  const backgroundColor = allMatchColors[sampleNodeId];

  const updateParagraphCitationCorrectness = () => onUpdateParagraphCitationCorrectness(sampleNodeId, userNodeId, nextCorrectness(paragraphCitationCorrectness));
  const updateExplanationCorrectness = () => onUpdateExplanationCorrectness(sampleNodeId, userNodeId, nextCorrectness(explanationCorrectness));

  return (
    <div style={{ backgroundColor }} className="p-2 rounded flex flex-row space-x-2">
      <CorrectnessSignal letter="§" correctness={paragraphCitationCorrectness} onClick={updateParagraphCitationCorrectness} />
      <CorrectnessSignal letter="E" correctness={explanationCorrectness} onClick={updateExplanationCorrectness} />
    </div>
  );
}
