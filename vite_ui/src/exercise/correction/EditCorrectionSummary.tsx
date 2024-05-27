import { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CorrectionSummaryFragment, ExerciseTextBlockFragment, useUpsertCorrectionSummaryMutation } from '../../graphql';
import { executeMutation } from '../../mutationHelpers';
import { isDefined } from '../../funcs';
import { TextBlockSelect } from './TextBlockSelect';
import update from 'immutability-helper';

interface CorrectionSummaryInput {
  comment: string;
  points: number;
}

interface IProps {
  exerciseId: number;
  username: string;
  initialValues: CorrectionSummaryFragment | undefined | null;
  textBlocks: ExerciseTextBlockFragment[];
  setKeyHandlingEnabled: (value: boolean) => void;
  onNewCorrectionSummary: (newSummary: CorrectionSummaryFragment) => void;
}

interface IState {
  summary: CorrectionSummaryInput;
  changed?: boolean;
  textBlocks: ExerciseTextBlockFragment[];
}

export function EditCorrectionSummary({ exerciseId, username, initialValues, textBlocks: initialTextBlocks, setKeyHandlingEnabled, onNewCorrectionSummary }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [{ summary: { comment, points }, changed, textBlocks }, setState] = useState<IState>({
    summary: isDefined(initialValues) ? initialValues : { comment: '', points: 0 },
    textBlocks: initialTextBlocks
  });

  const [upsertCorrectionSummary, { loading }] = useUpsertCorrectionSummaryMutation();

  const changeComment = (newValue: string) => setState((state) => update(state, { summary: { comment: { $set: newValue } }, changed: { $set: true } }));
  const changePoints = (newValue: number) => setState((state) => update(state, { summary: { points: { $set: newValue } }, changed: { $set: true } }));

  const onUpdate = () => comment.length > 0 && executeMutation(
    () => upsertCorrectionSummary({ variables: { exerciseId, username, comment, points } }),
    ({ exerciseMutations }) => {
      if (exerciseMutations?.userSolution?.updateCorrectionResult) {
        setState((state) => update(state, { changed: { $set: false } }));
        onNewCorrectionSummary(exerciseMutations.userSolution.updateCorrectionResult);
      }
    });

  const applyTextBlock = (blockIndex: number) => (textPart: string) => setState((state) => update(state, {
    summary: { comment: (c) => c + (c.trim().length === 0 ? '' : '\n') + textPart },
    changed: { $set: true },
    textBlocks: { $splice: [[blockIndex, 1]] }
  }));

  const dismissTextBlock = (blockIndex: number) => setState((state) => update(state, { textBlocks: { $splice: [[blockIndex, 1]] } }));

  return (
    <div className="my-4 p-2 rounded border border-slate-500 w-full">

      <label htmlFor="comment" className="font-bold">{t('comment')}:</label>
      <textarea id="comment" rows={5} placeholder={t('comment') || 'comment'} className="my-2 block p-2 rounded border border-slate-500 w-full"
        value={comment} onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)}
        onChange={(event) => changeComment(event.target.value)} />

      {textBlocks.map((textBlock, index) => <TextBlockSelect key={index} textBlock={textBlock} onApply={applyTextBlock(index)} onDismiss={() => dismissTextBlock(index)} />)}

      <div className="my-2 flex space-x-2">
        <label htmlFor="points" className="p-2 font-bold">{t('points')}:</label>
        <select id="points" className="p-2 flex-grow rounded border border-slate-500 bg-white w-full" value={points} onChange={(event) => changePoints(parseInt(event.target.value))}>
          <option value={undefined} />
          {Array.from({ length: 19 }, (_, index) => <option key={index}>{index}</option>)}
        </select>
      </div>

      <button type="button" className="my-2 p-2 rounded bg-blue-500 text-white w-full disabled:opacity-50" onClick={onUpdate}
        disabled={comment.length === 0 || points === undefined || !changed || loading}>
        {t('updateCorrectionSummary')}
      </button>
    </div>
  );
}
