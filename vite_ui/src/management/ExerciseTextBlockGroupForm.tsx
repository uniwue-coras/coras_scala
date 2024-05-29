import { ReactElement } from 'react';
import { DeleteIcon, DownTriangle, PlusIcon, UpTriangle, UpdateIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { ExerciseTextBlockInput } from '../graphql';

export interface MoveProps {
  upDisabled: boolean;
  downDisabled: boolean;
  up: () => void;
  down: () => void;
}

interface IProps {
  textBlock: ExerciseTextBlockInput;
  changed: boolean;
  updateStartText: (newText: string) => void;
  addEnd: () => void;
  updateEnd: (endIndex: number, newEnd: string) => void;
  deleteEnd: (endIndex: number) => void;
  submitBlock: () => void;
  deleteBlock: () => void;
  moveFuncs: MoveProps | undefined;
}

export function ExerciseTextBlockForm({ textBlock, changed, moveFuncs, updateStartText, addEnd, updateEnd, deleteEnd, submitBlock, deleteBlock }: IProps): ReactElement {

  const { startText, ends } = textBlock;

  const { t } = useTranslation('common');

  return (
    <div className="my-2 p-2 rounded border border-slate-400">

      <div className="flex flex-row">
        <div className="flex-grow">

          <input type="text" className="p-2 rounded border border-slate-500 w-full" defaultValue={startText} onChange={(event) => updateStartText(event.target.value)} />

          <div className="my-2 grid grid-cols-4 gap-2">
            {ends.map((end, endIndex) =>
              <div key={endIndex} className="flex flex-row">
                <input type="text" className="p-2 rounded-l border border-slate-500 flex-grow" defaultValue={end} onChange={(event) => updateEnd(endIndex, event.target.value)} />
                <button type="button" className="p-2 rounded-r border-r border-y border-slate-500 font-bold text-red-600" onClick={() => deleteEnd(endIndex)}>
                  <DeleteIcon />
                </button>
              </div>)}
          </div>

          <button type="button" className="p-2 font-bold text-cyan-600" onClick={addEnd}><PlusIcon /> {t('newContent')}</button>
        </div>

        <div className="flex flex-col">
          {moveFuncs && <button type="button" className="p-2 font-bold disabled:text-slate-300" onClick={moveFuncs.up} disabled={moveFuncs.upDisabled}>
            <UpTriangle />
          </button>}
          <button type="button" className="p-2 font-bold text-red-600" onClick={deleteBlock}><DeleteIcon /> {t('removeGroup')}</button>
          <button type="button" className="p-2 font-bold text-blue-600 disabled:text-slate-600" onClick={submitBlock} disabled={!changed || ends.length === 0}>
            <UpdateIcon /> {t('submitGroup')}
          </button>
          {moveFuncs && <button type="button" className="p-2 font-bold disabled:text-slate-300" onClick={moveFuncs.down} disabled={moveFuncs.downDisabled}>
            <DownTriangle />
          </button>}
        </div>
      </div>
    </div>
  );
}
