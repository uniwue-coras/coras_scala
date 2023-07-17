import {ReactElement, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  recommendations: string[];
  hideRecommendations: () => void;
  onSelect: (value: string) => void;
}

export function RecommendationSelect({recommendations, hideRecommendations, onSelect}: IProps): ReactElement {

  const {t} = useTranslation('common');
  const [currentId, setCurrentId] = useState(0);

  const recommendation = recommendations[currentId];

  const prior = (): void => setCurrentId((currentId) => currentId === 0 ? recommendations.length - 1 : (currentId - 1));
  const next = (): void => setCurrentId((currentId) => (currentId + 1) % recommendations.length);

  const applyRecommendation = (): void => onSelect(recommendation);

  return (
    <div className="p-2 rounded border border-slate-400">

      <div className="flex">
        <button type="button" className="px-2 font-bold" onClick={prior}>&lsaquo;</button>
        <span className="px-2 flex-grow text-center">({currentId + 1} / {recommendations.length})</span>
        <button type="button" className="px-2 font-bold" onClick={next}>&rsaquo;</button>
      </div>

      <p key={recommendation} className="p-2 flex-grow text-center italic">{recommendation}</p>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded border border-slate-500 w-full" onClick={hideRecommendations}>{t('hideRecommendations')}</button>
        <button type="button" className="p-2 rounded bg-blue-500 text-white w-full" onClick={applyRecommendation}>{t('applyRecommendation')}</button>
      </div>
    </div>
  );
}
