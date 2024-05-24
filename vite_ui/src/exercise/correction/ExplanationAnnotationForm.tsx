import { ReactElement, useState } from 'react';
import { CancelIcon, UpdateIcon } from '../../icons';
import { RecommendationSelect } from '../RecommendationSelect';
import { useTranslation } from 'react-i18next';

interface IProps {
  initialText: string;
  recommendations: string[];
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdate: (newText: string) => Promise<void>;
  onCancel: () => void;
}

export function ExplanationAnnotationForm({ initialText, recommendations, setKeyHandlingEnabled, onUpdate, onCancel }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [text, setText] = useState(initialText);

  const onSubmit = async () => {
    await onUpdate(text);
    onCancel();
  };

  return (
    <>
      <div className="flex flex-row space-x-2">
        <div className="flex-grow">
          <input defaultValue={text} onChange={(event) => setText(event.target.value)} className="p-2 rounded border border-slate-500 w-full"
            onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />
        </div>

        <button type="submit" className="text-blue-600 font-bold" onClick={onSubmit}><UpdateIcon /></button>
        <button type="button" className="text-red-600 font-bold" onClick={onCancel}><CancelIcon /></button>
      </div>

      {recommendations.length > 0
        ? <RecommendationSelect recommendations={recommendations} apply={setText} />
        : <div className="p-2 italic text-center text-cyan-600">{t('noRecommendationsFound')}</div>}
    </>

  );
}
