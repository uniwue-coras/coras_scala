import { ReactElement, useState } from 'react';
import { ExerciseTextBlockFragment } from '../../graphql';
import { DeleteIcon, UpdateIcon } from '../../icons';
import { useTranslation } from 'react-i18next';

interface IProps {
  textBlock: ExerciseTextBlockFragment;
  onApply: (value: string) => void;
  onDismiss: () => void;
}

export function TextBlockSelect({ textBlock: { startText, ends }, onApply, onDismiss }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [endIndex, setEndIndex] = useState(0);

  const onSubmit = () => onApply(startText.trim() + ' ' + ends[endIndex].trim() + (ends[endIndex].endsWith('.') ? '' : '.'));

  return (
    <div className="my-2 flex flex-row">
      <div className="p-2">{startText}</div>
      <select className="p-2 rounded border border-slate-500" onChange={(event) => setEndIndex(parseInt(event.target.value))}>
        {ends.map((end, index) => <option key={end} value={index}>{end}</option>)}
      </select>
      <button type="button" className="p-2 font-bold text-blue-600" onClick={onSubmit} title={t('apply')}><UpdateIcon /></button>
      <button type="button" className="p-2 font-bold text-red-600" onClick={onDismiss} title={t('dismiss')}><DeleteIcon /></button>
    </div>
  );
}
