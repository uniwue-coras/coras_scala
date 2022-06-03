import {useTranslation} from 'react-i18next';
import {SolutionEntryComment} from '../model/correction/corrector';

interface IProps {
  annotation: SolutionEntryComment;
  maximumValue: number;
  updateComment: (value: string) => void;
  updateStartIndex: (startIndex: number) => void;
  updateEndIndex: (endIndex: number) => void;
  onSubmit: () => void;
}

export function AnnotationSubmitForm({annotation, maximumValue, updateComment, updateStartIndex, updateEndIndex, onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {comment, startIndex, endIndex} = annotation;

  return (
    <>
      <div className="my-2">
        <input name="comment" className="p-2 rounded border border-slate-500 w-full" defaultValue={comment}
               onChange={(event) => updateComment(event.target.value)} placeholder={t('annotation')}/>
      </div>

      <div className="my-2 flex">
        <label htmlFor="startIndex" className="font-bold">{t('startIndex')}:</label>
        <input type="range" name="startIndex" id="startIndex" defaultValue={startIndex} min={0} max={endIndex}
               onChange={(event) => updateStartIndex(parseInt(event.target.value))} className="ml-2 flex-grow"/>
      </div>

      <div className="my-2 flex">
        <label htmlFor="endIndex" className="font-bold">{t('endIndex')}:</label>
        <input type="range" name="endIndex" id="endIndex" defaultValue={endIndex} min={startIndex} max={maximumValue}
               onChange={(event) => updateEndIndex(parseInt(event.target.value))} className="ml-2 flex-grow"/>
      </div>

      <button type="button" className="p-2 block rounded bg-blue-500 text-white w-full" onClick={onSubmit}>&#10004; {t('submitAnnotation')}</button>
    </>
  );
}
