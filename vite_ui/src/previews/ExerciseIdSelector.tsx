import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  exerciseId: number;
  allExerciseIds: number[];
  setExerciseId: (exerciseId: number) => void;
}

export function ExerciseIdSelector({ exerciseId, allExerciseIds, setExerciseId }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="text-center space-x-2">
      <label htmlFor="exerciseId" className="font-bold">{t('exerciseId')}:</label>
      <select id="exerciseId" defaultValue={exerciseId} onChange={(event) => setExerciseId(parseInt(event.target.value))}
        className="p-2 rounded border border-slate-500 bg-white">
        {allExerciseIds.map((exerciseId) => <option key={exerciseId}>{exerciseId}</option>)}
      </select>
    </div>
  );
}
