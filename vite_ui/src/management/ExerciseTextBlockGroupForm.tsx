import { ReactElement } from 'react';
import { DeleteIcon, PlusIcon, UpdateIcon } from '../icons';
import { useTranslation } from 'react-i18next';

interface IProps {
  textBlocks: string[];
  changed: boolean;
  updateContent: (contentIndex: number, newContent: string) => void;
  addContent: () => void;
  deleteGroup: () => void;
  submitGroup: () => void;
}

export function ExerciseTextBlockGroupForm({ textBlocks, changed, updateContent, addContent, deleteGroup, submitGroup }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="my-2 p-2 rounded border border-slate-400">
      <div className="flex flex-row">
        <div className="flex-grow">
          {textBlocks.map((content, contentIndex) => <div key={contentIndex}>
            <input type="text" className="my-1 p-2 rounded border border-slate-500 w-full" defaultValue={content} onChange={(event) => updateContent(contentIndex, event.target.value)} />
          </div>)}

          <button type="button" className="p-2 font-bold text-cyan-600" onClick={addContent}><PlusIcon /> {t('newContent')}</button>
        </div>

        <div className="flex flex-col">

          <button type="button" className="p-2 font-bold text-red-600" onClick={deleteGroup}><DeleteIcon /> {t('removeGroup')}</button>
          <button type="button" className="p-2 font-bold text-blue-600 disabled:text-slate-600" onClick={submitGroup} disabled={!changed || textBlocks.length === 0}>
            <UpdateIcon /> {t('submitGroup')}
          </button>
        </div>
      </div>
    </div>
  );
}
