import { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CorrectionSummaryFragment, useUpsertCorrectionSummaryMutation } from '../../graphql';
import { executeMutation } from '../../mutationHelpers';
import update from 'immutability-helper';

interface IProps {
  exerciseId: number;
  username: string;
  initialValues: CorrectionSummaryFragment | undefined;
  setKeyHandlingEnabled: (value: boolean) => void;
  onUpdated: (newSummary: CorrectionSummaryFragment) => void;
}

interface IState {
  comment: string | undefined;
  points: number | undefined;
}

export function EditCorrectionSummary({ exerciseId, username, initialValues, setKeyHandlingEnabled, onUpdated }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [{ comment, points }, setState] = useState<IState>(initialValues !== undefined ? initialValues : { comment: undefined, points: undefined });

  const [upsertCorrectionSummary, { loading }] = useUpsertCorrectionSummaryMutation();

  const onUpdate = async (): Promise<void> => {
    if (comment === undefined || points === undefined) {
      return;
    }

    return executeMutation(
      () => upsertCorrectionSummary({ variables: { exerciseId, username, comment, points } }),
      ({ exerciseMutations }) => exerciseMutations?.userSolution && onUpdated(exerciseMutations.userSolution.updateCorrectionResult)
    );
  };

  return (
    <div className="my-4 p-2 rounded border border-slate-500 w-full">

      <label htmlFor="comment" className="font-bold">{t('comment')}:</label>
      <textarea id="comment" rows={5} placeholder={t('comment') || 'comment'} className="my-2 block p-2 rounded border border-slate-500 w-full"
        value={comment} onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)}
        onChange={(event) => setState((state) => update(state, { comment: { $set: event.target.value } }))} />

      <div className="my-2 flex space-x-2">
        <label htmlFor="points" className="p-2 font-bold">{t('points')}:</label>
        <select id="points" className="p-2 flex-grow rounded border border-slate-500 bg-white w-full" value={points}
          onChange={(event) => setState((state) => update(state, { points: { $set: parseInt(event.target.value) } }))}>
          <option value={undefined} />
          {Array.from({ length: 19 }, (_, index) => <option key={index}>{index}</option>)}
        </select>
      </div>

      <button type="button" className="my-2 p-2 rounded bg-blue-500 text-white w-full disabled:opacity-50" onClick={onUpdate}
        disabled={comment === undefined || points === undefined || loading}>
        {t('updateCorrectionSummary')}
      </button>
    </div>

  );
}
