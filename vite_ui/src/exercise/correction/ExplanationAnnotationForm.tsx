import { ReactElement, useState } from 'react';
import { CancelIcon, UpdateIcon } from '../../icons';

interface IProps {
  initialText: string;
  onUpdate: (newText: string) => Promise<void>;
  onCancel: () => void;
}

export function ExplanationAnnotationForm({ initialText, onUpdate, onCancel }: IProps): ReactElement {

  const [text, setText] = useState(initialText);

  const onSubmit = async () => {
    await onUpdate(text);
    onCancel();
  };

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex-grow">
        <input defaultValue={text} onChange={(event) => setText(event.target.value)} className="p-2 rounded border border-slate-500 w-full" />
      </div>

      <button type="submit" className="text-blue-600 font-bold" onClick={onSubmit}><UpdateIcon /></button>
      <button type="button" className="text-red-600 font-bold" onClick={onCancel}><CancelIcon /></button>
    </div>
  );
}
