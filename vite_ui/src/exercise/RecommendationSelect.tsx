import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckmarkIcon } from '../icons';

interface IProps {
  recommendations: string[];
  apply: (value: string) => void;
}

export function RecommendationSelect({ recommendations, apply }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentId, setCurrentId] = useState(0);

  const recommendation = recommendations[currentId];

  const prior = (): void => setCurrentId((currentId) => currentId === 0 ? recommendations.length - 1 : (currentId - 1));
  const next = (): void => setCurrentId((currentId) => (currentId + 1) % recommendations.length);

  const applyRecommendation = (): void => apply(recommendation);

  return (
    <div className="flex flex-row space-x-2">
      <span className="p-2 text-center">({currentId + 1} / {recommendations.length})</span>

      <button type="button" className="p-2 font-bold disabled:opacity-50" onClick={prior} disabled={currentId <= 0}>&lsaquo;</button>

      <p key={recommendation} className="p-2 flex-grow text-center italic">{recommendation}</p>

      <button type="button" className="p-2 font-bold disabled:opacity-50" onClick={next} disabled={currentId >= recommendations.length - 1}>&rsaquo;</button>

      <button type="button" className="p-2 bg-white text-blue-500" onClick={applyRecommendation} title={t('apply')}><CheckmarkIcon /></button>
    </div>
  );
}
